import csv, os
import json
folderPath = '/Users/jennyseegers/Desktop/mysteries/'
all = []
##for file in os.listdir(folderPath):
##    path = file
##    stateAb = file.replace("Starlings", "").replace(".csv", "")
##    with open(folderPath + file, 'r', encoding='windows-1252') as csvinput:
##        with open('/Users/jennyseegers/Desktop/StarlingsWork/TxtData/testbyYear52.csv', 'w', encoding='utf-8') as csvoutput:
##              writer = csv.writer(csvoutput)
##              reader = csv.reader(csvinput)
##              
##              row = next(reader)
##              row.insert(0, 'State')
##              all.append(row)
##              for row in reader:
##                  all.append([stateAb] + row)
##              writer.writerows(all)
f = open( '/Users/jennyseegers/Desktop/mysteries/mysteries.csv', encoding = 'utf-8' )
reader = csv.DictReader(f, fieldnames=('Author', 'Title', 'Year', 'Location'))

out = json.dumps( [ row for row in reader ] )
print("JSON parsed!")
# Save the JSON
f = open( '/Users/jennyseegers/Desktop/mysteries/books.json', 'w')
f.write(out)
print("JSON saved!")
