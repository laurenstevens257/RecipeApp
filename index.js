//this is going to be where the magic happens

//import all of the libraries we will need to use (express, cors, mongoose)
//see video for help, im need to look more into all of this obviously
const app = express();

app.use(express.json());

app.use(cors());

app.listen(/*choose a port*/)
