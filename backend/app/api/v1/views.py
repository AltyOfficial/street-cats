from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import (AllowAny, IsAuthenticated,
                                        IsAuthenticatedOrReadOnly)
from rest_framework.response import Response

from posts.models import Post
from users.models import Follow, Profile, User
from utils.permissions import IsAuthorOrReadOnly

from .serializers import (PostCreationSerializer,
                          ProfileSeriazlizer, UserSerializer)


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostCreationSerializer
    permission_classes = [IsAuthorOrReadOnly]
    queryset = Post.objects.all()

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
            return Response('You upvoted the post', status=200)
        
        post.upvotes.remove(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['POST', 'DELETE', 'OPTIONS'], detail=True)
    def downvote(self, request, pk):
        """Дизлайк к посту, можно удалить."""

        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            raise ValidationError('post does not exist')

        if request.method == 'POST':
            post.upvotes.remove(request.user)
            post.downvotes.add(request.user)
            return Response('You downvoted the post', status=418)

        post.downvotes.remove(request.user)
        return Response(status=204)


class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSeriazlizer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Profile.objects.all()


# {
#     "caption": "test post caption 1",
#     "text": "test post text 1",
#     "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAgMAAABieywaAAAACVBMVEUAAAD///9fX1/S0ecCAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAACklEQVQImWNoAAAAggCByxOyYQAAAABJRU5ErkJggg==",
#     "meeted_at": "Indoors",
#     "season": 1,
#     "feeded": true
# }

