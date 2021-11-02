module load 2021 PETSc/3.15.1-foss-2021a  HDF5/1.10.7-gompi-2021a h5py/3.2.1-foss-2021a SWIG/4.0.2-GCCcore-10.3.0
pip3 install --user lavavu pint
cd cd /home/$USER
git clone https://github.com/underworldcode/underworld2.git
cd underworld2/underworld/libUnderworld
./configure.py --with-debugging=0
./compile.py -j8
