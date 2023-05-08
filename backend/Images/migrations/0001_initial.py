# Generated by Django 4.1.7 on 2023-03-13 20:13

import Images.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Properties', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=Images.models.image_upload_path)),
                ('num', models.IntegerField(choices=[('1', 1), ('2', 2), ('3', 3), ('4', 4), ('5', 5)])),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Properties.property')),
            ],
        ),
        migrations.AddConstraint(
            model_name='image',
            constraint=models.UniqueConstraint(fields=('property', 'num'), name='unique property image number'),
        ),
    ]