var mysql= require("mysql");
var inquirer= require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "79SGMZub!32#*Vzy",
    database: "bamazon"
})
connection.connect(function(err){
    if(err) throw err;
    console.log("connection success");
    makeTable();
})
var makeTable= function(){
    connection.query("SELECT * FROM products", function(_err, res){
        for(var i=0; i<res.length; i++){
            console.log(res[i].itemid+" || "+res[i].productname+" || "+res[i].departmentname+" || "+res[i].price+" || "+res[i].stockquantity+ "\n");
        }
    promptCustomer(res);
    })
} 
var promptCustomer= function(res){
    inquirer.prompt([{
        type: "input",
        name: "choice",
        message: "What item would like to purchase? [Quit with Q]"
    }]).then(function(answer){
        correct = false;
        if(answer.choice.toUpperCase()=="Q"){
            process.exit();
        } 
        for(var i=0; i<res.length; i++){
            if(res[i].productname == answer.choice){
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type:"input",
                    name:"quant",
                    message:"How many of this item would you like to buy?",
                        validate: function(value){
                            if(isNaN(value)==false){
                                return true;
                            }else {
                                return false;
                            }
                        }
                }).then(function(answer){
                    if((res[id].stockquantity - answer.quant)>0){
                        connection.query("UPDATE products SET stockquantity='" +(res[id].stockquantity - answer.quant)+"' WHERE productname='"+ product +"'", function(_err, _res2){
                            console.log("Product bought!");
                            makeTable();
                        })
                    }else{
                        console.log("Not a valid selection");
                        promptCustomer(res);
                    }
                })
            }
        }
        if(i == res.length && correct == false){
         console.log("Not a valid selection");
        promptCustomer(res);
        }
   })
}
