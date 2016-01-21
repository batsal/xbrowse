
xBrowse: Linux Development Instance at DBHi
====================================

The steps below can be used to set up an xBrowse development instance on your local MacOSX laptop or desktop.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [Prereqs](#prereqs)
- [Install](#install)
- [Load data](#load-data)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Prereqs

Choose or create a directory where you want to install xbrowse. 
In your terminal, set the envirnoment variable:  

`export XBROWSE_INSTALL_DIR=[directory where to install xbrowse]` 

This variable is only used during the install, but it's good to add it 
to your `~/.bashrc` anyway. 
That way you can just copy-paste other lines from the instructions below to your `~/.bashrc` since they are defined 
relative to `${XBROWSE_INSTALL_DIR}`. 

## Install

NOTE: root access may be required for some install commands. 
  
0. Create subdirectories:  
   `cd ${XBROWSE_INSTALL_DIR}`  
   `mkdir  code  data  data/reference_data  data/projects`  
  
0. Download xbrowse reference data. You may want to download these in the background. 
    `cd ${XBROWSE_INSTALL_DIR}/data/reference_data`  
    `wget http://xbrowse.broadinstitute.org/static/bundle/xbrowse-resource-bundle.tar.gz;  tar -xzf xbrowse-resource-bundle.tar.gz`  
    `wget ftp://ftp.ncbi.nih.gov/snp/organisms/human_9606_b142_GRCh37p13/VCF/00-All.vcf.gz   # download dbSNP v.142`  
    `wget ftp://dbnsfp:dbnsfp@dbnsfp.softgenetics.com/dbNSFPv2.9.zip;  unzip -d dbNSFP dbNSFPv2.9.zip`  
    `wget ftp://ftp.ncbi.nih.gov/pub/clinvar/vcf_GRCh37/clinvar.vcf.gz*`  
    `wget http://xbrowse.broadinstitute.org/static/bundle/ExAC.r0.3.sites.vep.popmax.clinvar.vcf.gz`  
  
    `cd ${XBROWSE_INSTALL_DIR}/data/projects`  
    `wget http://xbrowse.broadinstitute.org/static/bundle/1kg_project.tar.gz;  tar -xzf 1kg_project.tar.gz`  

    While these are downloading, you can proceed with the next steps.  

0. Download and install VEP. It's used by xBrowse to annotate variants. Also, we need tabix to optimize the VEP cache which is in  /nas/is1/bin/tabix
   `cd ${XBROWSE_INSTALL_DIR}`  
   `wget https://github.com/Ensembl/ensembl-tools/archive/release/78.zip`  
   `unzip 78.zip`  
   `mv ensembl-tools-release-78/scripts/variant_effect_predictor .`  
   `rm -rf 78.zip ensembl-tools-release-78`  
   `cd variant_effect_predictor`  
   `perl INSTALL.pl --AUTO acf --CACHEDIR ../vep_cache_dir --SPECIES homo_sapiens --ASSEMBLY  GRCh37 --CONVERT`  

   While it's installing, you may want to proceed with the next steps in a new terminal.  

0. Add MongoDB to your PATH. This is a NoSQL database that will hold large static datasets such as variants, annotations, etc.  
   Mongodb is in: /nas/is1/bin/mongodb/mongodb-linux-x86_64-3.2.1/bin/mongod
   `mongod --dbpath <directory where you want to store db files> &    # start MongoDB in the background`  

0. Install MySQL. A MySQL database isn't actually used, but the python mysql library (which is used to access Ensembl) requires MySQL to be installed.  
   path to mysql: /usr/bin/mysql  
  
0. Install python v2.7 if it's not installed already:  
  path to python2.7: /usr/bin/python2.7

0. Clone the xbrowse repo from github:  
   `cd ${XBROWSE_INSTALL_DIR}/code`  
   `git clone https://github.com/xbrowse/xbrowse.git`  

   and add these lines to your `~/.bashrc`:  
   `export PYTHONPATH=${XBROWSE_INSTALL_DIR}/code/xbrowse:$PYTHONPATH`  
   `export PYTHONPATH=${XBROWSE_INSTALL_DIR}/code/xbrowse/deploy/mac_osx/xbrowse_settings:$PYTHONPATH`  

0. Install python virtualenv and virtualenvwrapper. This allows specific versions of python libraries to be installed as needed for xBrowse without interfering with previously-installed libraries.  
   `/usr/bin/pip install virtualenvwrapper`  

   and add the following 4 lines to your `~/.bashrc`:  
   `export VIRTUALENVWRAPPER_VIRTUALENV_ARGS='--no-site-packages'  #  isolate new environments from global site-packages directory`  
   `export WORKON_HOME=$HOME/.virtualenvs`  
   `export PROJECT_HOME=$HOME/code`  
   `source /usr/bin/virtualenvwrapper.sh`  
  
0. Create a virtualenv and install all needed python libraries.  
   `mkvirtualenv xbrowse`  
   `cd ${XBROWSE_INSTALL_DIR}/code/xbrowse`  
   `pip install -r server_requirements_prereqs.txt`  
   `pip install -r server_requirements.txt`  

## Load example data

0. Switch to the xbrowse virtualenv.  
   `cd ${XBROWSE_INSTALL_DIR}/code/xbrowse`  
   `workon xbrowse`  
   
0. Initialize the database. This django command creates the database xBrowse uses for storing users, project and other metatada.  
   `./manage.py migrate`  

0. Load data from ${XBROWSE_INSTALL_DIR}/data/reference_data into the database.  
   `./manage.py load_resources`  

  This will take ~2 hours (a sequence of progress bars will show).  
  While it's loading, you may want to proceed with the next steps in a new terminal (but remember to repeat all of step 1).

0. Create superuser(s). This user will have access to all xBrowse projects on your development instance.  
   `./manage.py createsuperuser   # it will ask you to create a username and password`  

0. Start the development server:  
   `./manage.py runserver 10.30.4.241:8000`  

    You can now open [http://raboso:8000](http://raboso:8000) in your browser and login using the superuser credentials.  

0. Create the 1kg example project:  
   `./manage.py add_project 1kg`  
   
   If you now refresh [http://raboso:8000](http://raboso:8000), you should see the project appear.  

0. Initialize the project with the example data we downloaded earlier:  
   `./manage.py load_project_dir 1kg ${XBROWSE_INSTALL_DIR}/data/projects/1kg_project`  
   
   This adds the file paths to the database, but doesn't actually load the VCF data.  

0. To load the VCF data:
   `./manage.py load_project 1kg`



## Load your own data

0. Before data can be loaded into xBrowse, it has to be annotated with VEP to add a specific set of annotations - including those provide by the [dbNSFP](http://www.ensembl.info/ecode/loftee/) and [LoFTEE](http://www.ensembl.info/ecode/loftee/) plugins. Once these plugins have been installed, please use the following command to annotate your VCF file (here called my_data.vcf.gz): 
 
   ```perl ./vep/ensembl-tools-release-78/scripts/variant_effect_predictor/variant_effect_predictor.pl --everything --vcf --allele_number --no_stats --cache --offline --dir ./vep_cache/ --force_overwrite --cache_version 78 --fasta ./vep_cache/homo_sapiens/78_GRCh37/Homo_sapiens.GRCh37.75.dna.primary_assembly.fa --assembly GRCh37 --tabix --plugin LoF,human_ancestor_fa:./loftee_data/human_ancestor.fa.gz,filter_position:0.05,min_intron_size:15 --plugin dbNSFP,./reference_data/dbNSFP/dbNSFPv2.9.gz,Polyphen2_HVAR_pred,CADD_phred,SIFT_pred,FATHMM_pred,MutationTaster_pred,MetaSVM_pred -i my_data.vcf.gz -o my_data.vep.vcf.gz```

0. Once you have an annotated file, it can be loaded the same way as steps 6 to 8 in the 'Load example data' section. 
