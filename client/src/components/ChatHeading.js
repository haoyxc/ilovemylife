import React from 'react';
import { FaUserPlus } from 'react-icons/fa'
import { MdMoreHoriz } from 'react-icons//md/'

export default function(name) {

    return (
		<div className="chat-header">
			<div className="user-info">
				<div className="user-name">{name.name}</div>
				<div className="status">
					<div className="indicator"></div>
				</div>
			</div>
            <div className="options">
				<FaUserPlus />
				<MdMoreHoriz />
			</div>
		</div>
	);
}