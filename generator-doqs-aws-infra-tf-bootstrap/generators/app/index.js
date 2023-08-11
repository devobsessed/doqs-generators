'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  
  initializing() {
    this.log('INFO: initialize a new git repo.');
    this.spawnCommandSync('git', ['init', '--quiet']);
  }
  
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the ${chalk.red('doqs-aws-infra-tf-bootstrap')} generator!`
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'terraformVersion',
        message: 'What version of terraform to use?',
        default: '1.15.5'
      },
      {
        type: 'confirm',
        name: 'someAnswer',
        message: 'Would you like to enable this option?',
        default: true
      }
    ];


    return this.prompt(prompts).then(props => {
      this.log('INFO: list of prompt answers.');
      this.log(props);
      
      // save the final set of prompts to later be saved in .yo-rc config file
      this.config.set(props)

      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('doqs.yml'),
      this.destinationPath('doqs.yml')
    );

    this.fs.copy(
      this.templatePath('main.tf'),
      this.destinationPath('main.tf')
    );

    this.fs.copy(
      this.templatePath('output.tf'),
      this.destinationPath('output.tf')
    );

    this.fs.copy(
      this.templatePath('providers.tf'),
      this.destinationPath('providers.tf')
    );

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
        { terraformVersion: this.props.terraformVersion }
    );
  }

  
  install() {
    // run `npm install && bower install`
    // this.installDependencies();

    this.log('INFO: init terraform plugins');
    this.spawnCommandSync('terraform', ['init']);
  }

  end() {
    // save the configs to .yo-rc.json for referance
    this.config.save()
  }

};
