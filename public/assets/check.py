from os import listdir
from os.path import isfile, join

mypath = "./"
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

for file in onlyfiles:
  if file!="check.py" and file!='a.svg' and file!='.DS_Store':
    f = open(file,'r').read().replace("\n"," ")
    for i in range(1,8):
      count = f.count('id="'+str(i)+'"')
      if count != 1: # missing id or duplicating id
        print()
        print("missing or duplicating id in file: ", file)
        print("id: "+str(i)+" count: "+ str(count))
        print(f)
        print()