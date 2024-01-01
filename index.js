const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;
// https://book-management-4qw7.onrender.com
// middlewear 
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!')
})

// mongodb confiq here
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mern-book-store:1234567890@cluster0.wcl6ubr.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptionsobject to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const bookCollections = client.db("BookInventory").collection("Books");

        // insert a book to db: Post Method
        app.post("/upload-book", async (req, res) => {
            const data = req.body;
            // console.log(data);
            const result = await bookCollections.insertOne(data);
            res.send(result);
        })
        
        // // get all books from db
        // app.get("/all-books", async (req, res) => {
        //     const books = bookCollections.find();
        //     const result = await books.toArray();
        //     res.send(result)
        // })

        // get all books & find by a category from db
        app.get("/all-books", async (req, res) => {
            let query = {};
            if (req.query?.category) {
                query = { category: req.query.category }
            }
            const result = await bookCollections.find(query).toArray();
            res.send(result)
        })

        // update a books method
        app.patch("/book/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const updateBookData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    ...updateBookData
                }
            }
            const options = { upsert: true };

            // update now
            const result = await bookCollections.updateOne(filter, updatedDoc, options);
            res.send(result);
        })


        // delete a item from db
        app.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollections.deleteOne(filter);
            res.send(result);
        })


        // get a single book data
        app.get("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollections.findOne(filter);
            res.send(result)
        })

        // Favorite book
        const bookFavorite = client.db("BookInventory").collection("BooksFavorite");

        // insert a favorite book to db: Post Method
        app.post("/upload-favorite-book", async (req, res) => {
            const data = req.body;
            const result = await bookFavorite.insertOne(data);
            res.send(result);
        });

        // get all favorite books from db
        app.get("/all-favorite-books", async (req, res) => {
            const result = await bookFavorite.find().toArray();
            res.send(result);
        });

        // update a favorite book method
        app.patch("/favorite-book/:id", async (req, res) => {
            const id = req.params.id;
            const updateFavoriteBookData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    ...updateFavoriteBookData
                }
            };
            const options = { upsert: true };

            const result = await bookFavorite.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // delete a favorite book from db
        app.delete("/favorite-book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookFavorite.deleteOne(filter);
            res.send(result);
        });

        // get a single favorite book data
        app.get("/favorite-book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookFavorite.findOne(filter);
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})