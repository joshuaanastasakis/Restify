# Generated by Django 4.1.7 on 2023-03-13 20:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(max_length=200)),
                ('city', models.CharField(max_length=200)),
                ('province', models.CharField(max_length=200)),
                ('postal', models.CharField(max_length=200)),
                ('country', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('name', models.CharField(max_length=200)),
                ('max_guests', models.IntegerField()),
                ('num_bed', models.IntegerField()),
                ('num_bath', models.IntegerField()),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.user')),
            ],
        ),
    ]
