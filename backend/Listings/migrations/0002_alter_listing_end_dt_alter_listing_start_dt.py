# Generated by Django 4.1.7 on 2023-04-04 02:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Listings', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='end_dt',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='listing',
            name='start_dt',
            field=models.DateField(),
        ),
    ]
