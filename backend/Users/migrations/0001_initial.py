# Generated by Django 4.1.7 on 2023-03-13 20:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=200)),
                ('last_name', models.CharField(max_length=200)),
                ('email', models.EmailField(max_length=200)),
                ('password', models.CharField(max_length=200)),
                ('phone', models.IntegerField()),
                ('avatar', models.ImageField(upload_to='users/avatars')),
                ('is_host', models.BooleanField(default=False)),
            ],
        ),
    ]
