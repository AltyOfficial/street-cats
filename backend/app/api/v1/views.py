from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import (AllowAny, IsAdminUser,
                                        IsAuthenticatedOrReadOnly)
from rest_framework.response import Response

from posts.models import Post
from users.models import Follow, Profile, User
from utils.filters import PostFilter
from utils.permissions import IsAuthorOrReadOnly

from .serializers import (PostCreationSerializer,
                          ProfileSeriazlizer, UserSerializer)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostCreationSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PostFilter

    @action(methods=['POST', 'DELETE'], detail=True)
    def upvote(self, request, pk):
        """Лайк к посту, так же его можно удалить."""

        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            raise ValidationError('post does not exist')
        
        if request.method == 'POST':
            post.downvotes.remove(request.user)
            post.upvotes.add(request.user)
            return Response('You upvoted the post', status=201)
        
        post.upvotes.remove(request.user)
        return Response(status=204)

    @action(methods=['POST', 'DELETE'], detail=True)
    def downvote(self, request, pk):
        """Дизлайк к посту, можно удалить."""

        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            raise ValidationError('post does not exist')

        if request.method == 'POST':
            post.upvotes.remove(request.user)
            post.downvotes.add(request.user)
            return Response('You downvoted the post', status=201)

        post.downvotes.remove(request.user)
        return Response(status=204)
