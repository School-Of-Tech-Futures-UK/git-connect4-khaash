//express stuff here
const express = require('express')
const cors = require('cors')
const res = require('express/lib/response')
const { process_params } = require('express/lib/router')
const app = express()

app.use(express.json())
app.use(cors())

const savedPlayerScores={} //player scores saved here
    
app.post('/data', (req, res)=>{
    console.log("data received back end", req.body)
    const data = req.body // = [player, score]

    if (savedPlayerScores[data[0]]===undefined){
        savedPlayerScores[data[0]] = data[1]
    }else if (savedPlayerScores[data[0]]<data[1]){
        savedPlayerScores[data[0]] = data[1]
    }

    console.log(savedPlayerScores)
    res.send("")
}
)

app.get('/data', (req, res)=>{
    console.log("data sent from back end", savedPlayerScores)
    res.send(savedPlayerScores)
})

app.listen(3000, ()=> console.log("Server started"))