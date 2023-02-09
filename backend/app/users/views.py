from api.v1.serializers import (ChangePassowrdValidator, ProfileSeriazlizer,
                                UserSerializer)
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from utils.permissions import IsCurrentUserOrReadOnly

from .models import Follow, Profile

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = PageNumberPagination

    def get_permissions(self):
        if self.request.method == 'POST' and self.action == 'create':
            return [AllowAny(), ]

        return [IsCurrentUserOrReadOnly(), ]

    @action(methods=['GET', ], detail=False)
    def me(self, request):
        user = get_object_or_404(User, pk=request.user.id)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=200)

    @action(methods=['GET', ], detail=False)
    def subscriptions(self, request):
        follows = Follow.objects.filter(follower=request.user).values('author')
        users = User.objects.filter(pk__in=follows)
        serializer = UserSerializer(
            users, many=True, context={'request': request}
        )

        return Response(serializer.data, status=200)

    @action(methods=['POST', 'DELETE', ], detail=True,)
    def follow(self, request, pk):
        user = get_object_or_404(User, pk=pk)

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

    @action(methods=['PATCH', ], detail=False)
    def change_profile_picture(self, request):

        profile = Profile.objects.get(user=request.user)

        serializer = ProfileSeriazlizer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response('picture updated', status=200)

    @action(methods=['POST', ], detail=False)
    def set_password(self, request):
        user = self.request.user
        serializer = ChangePassowrdValidator(data=request.data)

        if serializer.is_valid():
            old_password = serializer.data.get('current_password')

            if not user.check_password(old_password):
                return Response(
                    {'current_password': 'Wrong Password'}, status=400
                )

            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response(status=204)

        return Response(serializer.errors, status=400)
