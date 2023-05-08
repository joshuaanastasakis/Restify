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
            name='Amenity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(choices=[('gym', 'gym'), ('laundry', 'laundry'), ('dryer', 'dryer'), ('kitchen', 'kitchen'), ('AC', 'AC'), ('heat', 'heat'), ('BBQ', 'BBQ'), ('sauna', 'sauna'), ('hot tub', 'hot tub'), ('fireplace', 'fireplace')], max_length=200)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='amenities', to='Properties.property')),
            ],
        ),
    ]
