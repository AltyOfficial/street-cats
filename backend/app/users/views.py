from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from api.v1.serializers import UserSerializer

from .models import Follow, Profile, User


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return (AllowAny(),)

        return (IsAuthenticated(),)

    @action(
        methods=['GET'], detail=False,
        permission_classes=[IsAuthenticated]
    )
    def me(self, request):
        user = get_object_or_404(User, pk=request.user.id)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=200)
    
    @action(
        methods=['POST', 'DELETE'], detail=False,
        permission_classes=[IsAuthenticated]
    )
    def follow(self, request, *args, **kwargs):
        user = get_object_or_404(User, username=kwargs['username'])

        if request.user == user:
            raise serializers.ValidationError(
                'You cannot do this with you own profile.'
            )

        if request.method == 'POST':
            follow = Follow.objects.get_or_create(
                follower=request.user,
                author=user
            )

            return Response(f'you followed {user.username}', status=201)
        
        follow = get_object_or_404(Follow, follower=request.user, author=user)
        follow.delete()

        return Response(f'you unfollowed {user.username}', status=204)
