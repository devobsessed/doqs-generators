# DOQS Generators

This repo contains a numper of NPM packages.  The packages are all valid
[Yeoman](https://yeoman.io) generators.  These generators make up the DevObsessed
Quick Start product named DOQS.  DOQS is used to generate new git repos for new clients
that need cloud infra, an app, and a database.

The goal of DOQS is:

Assuming access to an AWS account, we should be able to accomplish the following in under 1 hour:

- Generate git repos for cloud infra and an application
- Deploy an application via CI/CD on push to `main`
- Find the public DNS name in the deploy logs and access the new app
- App should support:
    - login/logout
    - database migrations
    - unit tests
    - functioning CI/CD pipeline
    - full IAC support via terraform for all cloud infra
- Infra should have:
    - ability to bootstrap terraform s3 and dynomo pre-reqs 
    - private and public subnets across 3 AZs
    - billing alerts
    - 

## Create a new Generator

    brew install node

    # install yeoman
    # see https://yeoman.io/learning/
    npm install -g yo

    # install the generator-gnerator
    # see
    #   https://yeoman.io/authoring/
    #   https://github.com/yeoman/generator-generator
    npm install -g yo generator-generator

    # create your new generator, follow the wizard
    # NOTE: The named must begin with 'doqs-'
    # NOTE: the package keywords must include 'yeoman-generator' at minimum
    # NOTE: choose "no license" copyrighted option.
    # NOTE: the username or company name should be "devobsessed"
    yo generator

    # remove the .git folder from the new generator
    # this is auto generate by yeoman, we delete it because we are managing this repo as a mono repo and not with git subrepos
    rm -rf ./generator-doqs-my-new-generator/.git

    # remove the LICENSE file
    rm ./generator-doqs-my-new-generator/LICENSE


There should be a new dir and the root of this repo, your new template files
will be placed in `./generator-<mynewgenerator>/generators/app/templates` dir.

See the [Yeoman docs](https://yeoman.io/learning/) for more info on how to build generators.


# General steps fpr using the generators in this repo

This repo contains multiple NPM packages.  None of them have been published to a repository.
To use then, you will have to `npm link` them to make them globally avaible to the `yo` tool.
Below are the steps to link all these packages and an example of how to use them.

    # make the individual generators avaible to npm locally
    find . -name 'generator-doqs-*' -depth 1 -type d | xargs npm link

    # install deps
    npm install

    # Create a new dir in your projects folder to test the generator for exmple:
    cd ~/projects
    mkdir somecompany-aws-infra-bootstrap
    cd somecompany-aws-infra-bootstrap
    yo aws-infra-bootstrap

    # to see a list og all the generators
    yo --help

    # to see a list of all the dows generators
    yo --help | grep doqs


