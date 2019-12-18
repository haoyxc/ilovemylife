import React, { Component } from 'react';

export default class Messages extends Component {

    constructor(props) {
        super(props);
          
          this.scrollDown = this.scrollDown.bind(this)
    }
  
	//Automatically have the scroll bar be at the bottom
    scrollDown(){
        const { container } = this.refs
        container.scrollTop = container.scrollHeight
    }

    componentDidMount() {
        this.scrollDown()
    }

    componentDidUpdate(prevProps, prevState) {
        this.scrollDown()
    }
      

    render() {
		const { messages, user, typingUsers } = this.props
		return (
			<div ref='container'
				className="thread-container">
				<div className="thread">
                    
					{
						//Makes sure the message sent as the time, message, and the name of the sender
						messages.map((mes)=>{
							return (
								<div
									key={mes.id}
									className={`message-container ${mes.sender === user.name && 'right'}`}
								>
									<div className="time">{mes.time}</div>
									<div className="data">
										<div className="message">{mes.message}</div>
										<div className="name">{mes.sender}</div>
									</div>
								</div>

								)
						})
					}

				</div>


			</div>
		);
	}
}