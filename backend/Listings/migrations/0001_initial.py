# Generated by Django 4.1.7 on 2023-03-13 20:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Properties', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_dt', models.DateTimeField()),
                ('end_dt', models.DateTimeField()),
                ('price', models.FloatField()),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Properties.property')),
            ],
        ),
    ]
