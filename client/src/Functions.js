const uuidv4 = require('uuid/v4')

//Create a new user
const createUser = ({name = "", socketId = null} = {})=>(
	{
		id:uuidv4(),
		name,
		socketId
		
	}
)

//Create a message using the current time
const createMessage = ({message = "", sender = ""} = { })=>(
		{
			id:uuidv4(),
			time:getTime(new Date(Date.now())),
			message,
			sender	
		}

	)

//Allows you to load a previous message from the database
const loadMessage = ({message = "", sender = "", time = ""} = { })=>(
	{
		id:uuidv4(),
		time,
		message,
		sender	
	}

)

//Create a new chat --> Default is the Community Group Chat
const createChat = ({messages = [], name = "Group", users = []} = {})=>(
	{
		id:uuidv4(),
		name,
		messages,
		users,
		typingUsers:[]
	}
)

//Get the current time
const getTime = (date)=>{
	return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

module.exports = {
	createMessage,
	createChat,
	createUser,
	loadMessage
}