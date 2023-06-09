# Generated by Django 4.1.7 on 2023-03-13 20:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Users', '0001_initial'),
        ('Properties', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_dt', models.DateTimeField()),
                ('end_dt', models.DateTimeField()),
                ('cost', models.FloatField()),
                ('status', models.CharField(choices=[('PENDING', 'PENDING'), ('DENIED', 'DENIED'), ('EXPIRED', 'EXPIRED'), ('APPROVED', 'APPROVED'), ('CANCELLED', 'CANCELLED'), ('TERMINATED', 'TERMINATED'), ('COMPLETED', 'COMPLETED')], max_length=200)),
                ('review_rating', models.IntegerField()),
                ('review_comment', models.TextField(max_length=200)),
                ('review_dt', models.DateTimeField()),
                ('host_reply1', models.TextField(max_length=200)),
                ('host_reply1_dt', models.DateTimeField()),
                ('user_reply2_comment', models.TextField(max_length=200)),
                ('user_reply2_dt', models.DateTimeField()),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Properties.property')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.user')),
            ],
        ),
    ]
