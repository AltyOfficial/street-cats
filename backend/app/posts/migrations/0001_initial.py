# Generated by Django 4.1.5 on 2023-02-07 15:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('caption', models.CharField(max_length=200, verbose_name='caption')),
                ('text', models.TextField(blank=True, verbose_name='text')),
                ('image', models.ImageField(upload_to='posts/images/', verbose_name='image')),
                ('meeted_at', models.CharField(choices=[('Outdoors', 'Outdoors'), ('Indoors', 'Indoors'), ('Mixed', 'Mixed')], max_length=20)),
                ('feeded', models.BooleanField(default=False)),
                ('pub_date', models.DateTimeField(auto_now_add=True, db_index=True)),
            ],
            options={
                'verbose_name': 'Post',
                'verbose_name_plural': 'Posts',
                'ordering': ('-pub_date',),
            },
        ),
        migrations.CreateModel(
            name='Season',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, unique=True, verbose_name='title')),
                ('color', models.CharField(max_length=7, verbose_name='color')),
                ('slug', models.SlugField(unique=True, verbose_name='slug')),
            ],
            options={
                'verbose_name': 'Season',
                'verbose_name_plural': 'Seasons',
                'ordering': ('title',),
            },
        ),
    ]
