# -*- coding: utf-8 -*-
from setuptools import setup, find_packages
from codecs import open  # To use a consistent encoding
from os import path

here = path.abspath(path.dirname(__file__))

# Get the long description from the relevant file
with open(path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='ckanext-skt_theme',
    version='0.0.1',
    description='SKT Template 2021',
    long_description=long_description,
    long_description_content_type="text/markdown",
    url='https://github.com/rvizcarra-eclipse/ckanext-skt_theme',
    author='Reine Vizcarra',
    author_email='reine@eclipsegeomatics.com',
    license='AGPL',
    classifiers=[
        'Development Status :: 4 - Beta',
        'License :: OSI Approved :: GNU Affero General Public License v3 or later (AGPLv3+)',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
    ],
    keywords='CKAN template',
    packages=find_packages(exclude=['contrib', 'docs', 'tests*']),
    install_requires=[
        # Dependencies should be listed in requirements.txt
    ],
    include_package_data=True,
    entry_points='''
        [ckan.plugins]
        skt_theme=ckanext.skt_theme.plugin:SktThemePlugin

        [babel.extractors]
        ckan = ckan.lib.extract:extract_ckan
    ''',
    message_extractors={
        'ckanext': [
            ('**.py', 'python', None),
            ('**.js', 'javascript', None),
            ('**/templates/**.html', 'ckan', None),
        ],
    }
)
