# Generated by Django 4.2 on 2024-02-25 06:10

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
                ('email', models.CharField(max_length=128)),
                ('name', models.CharField(max_length=256)),
                ('gender', models.CharField(max_length=1)),
                ('username', models.CharField(max_length=128)),
                ('password', models.CharField(max_length=128)),
            ],
        ),
    ]
