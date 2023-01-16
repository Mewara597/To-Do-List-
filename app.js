const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const _= require('lodash');
const date = require(__dirname + '/date.js')
const mongoose = require('mongoose')
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

let items = ["wakeup", "takeBath", "goToMandir"]
let workListItems = [];

mongoose.connect('mongodb+srv://admin:admin@cluster0.jdo20sp.mongodb.net/todoListDB');
// mongoose.connect("mongodb+srv://admin:admin@cluster0.jdo20sp.mongodb.net/todoListDB")
const itemsSchema = { name: String }

const Item = mongoose.model("Item", itemsSchema)

const Item1 = new Item({name: 'your todo List!'})
const Item2 = new Item({name: 'welcome to new day'})

const Item3 = new Item({name: 'hit the check box to delete this item'})

// let defaultValue = [{name : 'your todo List!'},{name : 'welcome to new day'},{name : 'hit the check box to delete this item'}]
let defaultValue = [Item1, Item2, Item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)


app.get('/', function (req, res) {
    // let currentDay = today.getDay();

    Item.find({}, function (err, foundItems) {

        if (foundItems.length == 0) {
            Item.insertMany(defaultValue, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Successfully saved');
                }
            })
            res.redirect('/')
        } else {
            let day = date.getDate();
            res.render('list', { listTitle: day, newListItems: foundItems });
        }
        // console.log(foundItems);
    })
})

app.post('/', (req, res) => {
    console.log(req.body);
    const itemName = req.body.newItem;
    const listName = req.body.list

    console.log('listName', listName);
    const item = new Item({
        name: itemName
    })

    if(listName === 'Today'){
        item.save()
        res.redirect('/')
    }else{
        List.findOne({name: listName}, function(err, foundList){
            console.log('foundList ', foundList);
            foundList.items.push(item);
            foundList.save();
            res.redirect('/'+ listName)
        })
    }


    // if (req.body.list == "Work") {
    //     workListItems.push(req.body.newItem)
    //     res.redirect('/work')
    // } else {
    //     let task = req.body.newItem
    //     items.push(task)
    //     res.redirect('/');
    // }
})

app.post("/delete", function (req, res) {
    console.log('workcheck ' , req.body);
    const listName = req.body.listName;

    const checkedItemId = req.body.checkbox;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log('item deleted successfully');
                res.redirect('/');    
            }
        })
    }else{
        List.findOneAndUpdate({name:listName}, {$pull: {items: {_id: checkedItemId}}} , function(err, foundList){
            if(!err){
                res.redirect('/' + listName);
            }
        })
    }


})

// app.get('/work', function (req, res) {
//     res.render("list", { listTitle: "Work List", newListItems: workListItems })
// })

app.get('/:customListName', function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
    console.log(customListName);

   

    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                // console.log('Doesnt exist');
                const list = new List({
                    name: customListName,
                    items: defaultValue
                })
                list.save()
                res.redirect('/' +customListName )
            }else {
                // console.log('Exist!');
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items })
                // res.redirect('/' +customListName )

            }
        }else{
            console.log('error' + err);
        }
    })

  

})

app.post('/work', function (req, res) {
    let item = req.body.newItem;
    workListItems.push(item)
    res.redirect('/work')
})


app.get('/about', function (req, res) {
    res.render('about')
})

app.listen(3000, function () {
    console.log('server started on port 3000');
})