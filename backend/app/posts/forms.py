from django.forms import ModelForm
from django.forms.widgets import TextInput

from .models import Season


class SeasonForm(ModelForm):
    class Meta:
        model = Season
        fields = '__all__'
        widgets = {
            'color': TextInput(attrs={'type': 'color'}),
        }
