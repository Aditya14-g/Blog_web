import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app=express();

const port=3000;
app.use(express.static("public"));
app.use(express.json());

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.get("/Education",(req,res)=>{
    res.render("education.ejs");
});
app.get("/project",(req,res)=>{
    res.render("project.ejs");
});

app.get("/work",(req,res)=>{
    res.render("work.ejs");
});
app.get("/Blog",(req,res)=>{
    res.render("Blog.ejs");
})
// app.post("/Blog",(req,res)=>{
//     res.render("Blog.ejs",{f:val});
// })
app.get("/add-blogs",(req,res)=>{
    res.render("add_blogs.ejs");
})
const initializeFile = () => {
    const filePath = path.join('output.json');
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]', 'utf8'); // Create an empty JSON array
    }
};

// Append to a file
app.post('/add-blogs', (req, res) => {
    const newData = req.body;
    const filePath = path.join('output.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') { // 'ENOENT' means file does not exist
            console.error('Error reading from file', err);
            res.status(500).send('Error reading from file');
            return;
        }

        let entries = [];
        if (data) {
            try {
                entries = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON from file', parseErr);
                res.status(500).send('Error parsing JSON from file');
                return;
            }
        }

        entries.push(newData);

        fs.writeFile(filePath, JSON.stringify(entries, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to file', writeErr);
                res.status(500).send('Error writing to file');
                return;
            }

            res.render("add_blogs.ejs");
        });
    });
});

// Read from a file with title-based filtering
app.post('/Blog', (req, res) => {
    const title = req.body;
    const filePath = path.join('output.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading from file', err);
            res.status(500).send('Error reading from file');
            return;
        }

        let entries;
        try {
            entries = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON from file', parseErr);
            res.status(500).send('Error parsing JSON from file');
            return;
        }

        // if (title) {
        //     entries = entries.filter(entry => {
        //         entry.title === title
        //         console.log(entry.title);
        //     });
        //     console.log(entries);
        // }
        if(entries.title===title){
            console.log(entries);
            res.render("Blog.ejs",{t:entries.title,c:entries.content});
            return;
        }
        console.log("hello");
        console.log(entries);
        res.render("Blog.ejs",{t:entries.title,c:entries.content});
    });
});

app.listen(port,()=>{
    console.log(`Connected to ${port}.`);
    initializeFile();
})