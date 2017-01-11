###################################################################################
#                                                                                 #
#                     Laden und kombinieren der Daten as JSON                     #                  
#                                                                                 #
###################################################################################

US_total_100k_inhabitatns_csv = read.csv(file='../src/assets/data/CrimeInTheUS_Volume_Rate_per_100000_inhabitants_1996-2015.csv',  header = T, sep = ";", quote = "\"", dec = ".", fill = TRUE, comment.char = "")

US_total_100k_inhabitatns_data = t(US_total_100k_inhabitatns_csv)

require(RJSONIO)

makeList<-function(x){
  if(ncol(x)>2){
    listSplit<-split(x[-1],x[1],drop=T)
    lapply(names(listSplit),function(y){list(name=y,children=makeList(listSplit[[y]]))})
  }else{
    lapply(seq(nrow(x[1])),function(y){list(name=x[,1][y],Percentage=x[,2][y])})
  }
}


jsonOut<-toJSON(list(name="MyData",children=makeList(MyData[-1])))
cat(jsonOut)
