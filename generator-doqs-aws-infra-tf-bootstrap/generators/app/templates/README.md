# Infra Bootstrap

This step is to prepare a new account/org for use with teraform.
It creates the S3 bucket, DynamoDB, and IAM resources needed by terraform to keep its state in S3.

We use Trussworks bootstap module to prepare the account for TF use, see:

- https://registry.terraform.io/modules/trussworks/bootstrap/aws/latest
- https://github.com/trussworks/terraform-aws-bootstrap


## When to use this step

This is only needed once per AWS account/org.  Once this is
in place it never needs to be updated.  This step doesnt
really need to be run via CI, it's usually acceptable to run 
this once from a workstation.

## Pre-reqs

This repo requires a few pre-requisites before you can use this repo.
We assume you are using MacOS, but Windows and Linux should both work
similarly, you'll just need to update the install commands to suit the 
package manager of your chosen OS.

    brew install git
    brew install tfenv
    brew install go-task
    tfenv install <%= terraformVersion %>
    tfenv use <%= terraformVersion %>


## How to bootstrap a new account

1) Clone this repo
2) Delete the `.git` dir, and reinitialize a new repo with `git init`
3) Update the defaults in variables.tf
4) Do the bootstrapping operation:

    cd ./bootstrap

    # set AWS creds in your local shell, e.g.
    export AWS_ACCESS_KEY_ID=AK***************XQ
    export AWS_SECRET_ACCESS_KEY=gb*******************************fS
    export AWS_SESSION_TOKEN="IQo**************************************xF"

    terraform init

    terraform fmt

    terraform validate

    terraform plan

    terraform apply

Note the value of the `sample-provider-file` terraform output variable in your shell.  Save this value for later.

At this point the tf state files are on your local machine
State file should contain no secrets and be safe to commit
Lets create a branch, and commit the statefile as a backup just in case

    cd ../
    # you should now be in the ./doqs-aws-infra dir
    git checkout -b temp-state-file
    git add -f terraform.tfstate*
    git commit -m "temp commit of state file, will delete later"

Now we have our statefile backed up to a branch, just in case, and
we have a copy of the `sample-provider-file` output var for the next steps.
Its time to move the state out to the new s3 bucket we just created.
This is a one time operation, it only happens once per AWS account.

    cd ./bootstrap

Update the `provider.tf` file with the contents of the `sample-provider-file` output var.
The new `provider.tf` should be identical to the revious version with an additional `backend "s3"` block.

    # init the new backend
    # when prompted, answer 'yes' to copy existing state to the new backend.
    terraform init

    # optionally, navigate to the new s3 bucket and confirm your state files are present.

    # delete the local state file
    rm ./terraform.tfstate
    rm -f ./terraform.tfstate.backup

    # test the new remote state
    # running a plan, should show no changes.
    terraform plan

This completes the boot strapping process

# Un-bootstrapping, deleting all bootstrapped resources

To reverse this process and delete everything, you would run these steps in reverse.

    cd ./bootstrap

    # fetch a copy of the state, into a local state file
    terraform state pull > terraform.tfstate

    # modify the providers.tf file, remove the `backend "s3"` block.

    # initialize the new local backend
    terraform init -migrate-state

    # test the new local state, terraform plan should show zero changes
    terraform plan

    # delete all bootstrapped infra
    # Note: you may have to manually empty the state file bucket because of file versioning
    # before terraform is able to fully delete the buckets.
    terraform destroy
