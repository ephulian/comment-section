import data from './data.json' assert { type: 'json' };

// history.scrollRestoration = 'manual';

const dataURL = 'http://localhost:3000/allData';
async function getData(url) {
	try {
		const data = await fetch(url);
		const response = await data.json();

		return response;
	} catch (error) {
		console.log(error);
	}
}

const myData = await getData(dataURL);
console.log(myData);

const newComment = document.querySelector('#new-comment');
const newCommentSendBTN = document.querySelector('#send');
const newCommentTextContent = document.querySelector('#comment-text-area');

const resetBTN12345 = document.getElementById('reset-btn');
resetBTN12345.addEventListener('click', () => {
	localStorage.setItem('data', JSON.stringify(data));
	location.reload();
});

let localData = JSON.parse(localStorage.getItem('data'));

newCommentSendBTN.addEventListener('click', () => {
	console.log(localData.comments.length);
	const comment = {
		id: localData.comments.length + 1,
		content: newCommentTextContent.value,
		createdAt: 'Now',
		score: 0,
		user: localData.currentUser,
		replies: [],
	};
	console.log(comment);
	localData.comments.push(comment);
	localStorage.setItem('data', JSON.stringify(localData));
	location.reload();
});

newCommentTextContent.addEventListener('keypress', (e) => {
	if (e.key == 'Enter') {
		const comment = {
			id: localData.comments.length + 1,
			content: newCommentTextContent.value,
			createdAt: 'Now',
			score: 0,
			user: localData.currentUser,
			replies: [],
		};
		console.log(comment);
		localData.comments.push(comment);
		localStorage.setItem('data', JSON.stringify(localData));
		location.reload();
	}
});

class addComment {
	constructor(comment, type) {
		this.comment = comment;
		this.type = type;

		// Section Center
		this.sectionCenter = document.createElement('section');
		this.sectionCenter.classList.add('section-center');
		this.sectionCenter.innerHTML = `
		<div class="${this.type}-container">
			<div class="score">
				<div class="score-btn-container">
					<h1 class="up">+</h1>
				</div>
				<h1 class="current-score">${this.comment.score}</h1>
				<div class="score-btn-container">
				<h1 class="down">-</h1>
				</div>
			</div>
			<div class="main-section">
				<div class="user">
					<div class="user-info">
						<div class="user-img-container">
							<img class="user-img" src="${this.comment.user.image.png}" alt="profile photo">
						</div>
						<h2 class="username">
						${this.comment.user.username}
						</h2>
						<h2 class="created-at">${this.comment.createdAt}</h2>
					</div>
				<div class="reply-delete-buttons-container">
					<h1 class="delete">Delete</h1>
					<h1 class="reply-edit">Reply</h1>
				</div>
				</div>
				<p class="comment-content">${this.comment.content}</p>
			</div>
		</div>
		`;

		// Scoring
		this.score = this.sectionCenter.querySelector('.score');
		this.up = this.sectionCenter.querySelector('.up');
		this.down = this.sectionCenter.querySelector('.down');
		this.currentScore = this.sectionCenter.querySelector('.current-score');

		// Reply/Edit/Delete
		this.replyButton = this.sectionCenter.querySelector('.reply-edit');
		this.deleteButton = this.sectionCenter.querySelector('.delete');
		this.replyDeleteButtonsContainer = document.querySelector('.reply-delete-buttons-container');

		// Editing text
		this.commentContentText = this.sectionCenter.querySelector('.comment-content');
		this.mainSection = this.sectionCenter.querySelector('.main-section');

		// Add all to DOM
		document.body.insertBefore(this.sectionCenter, newComment);

		// Delete button only for current users comments
		if (localData.currentUser.username === this.comment.user.username) {
			this.deleteButton.style.display = 'block';
			this.replyButton.innerHTML = 'Edit';
		} else {
			this.replyButton.innerHTML = 'Reply';
		}

		// Bind this to all functions
		this.scoreUp = this.scoreUp.bind(this);
		this.scoreDown = this.scoreDown.bind(this);
		this.addReply = this.addReply.bind(this);

		// Score functionality
		this.score.addEventListener(
			'click',
			(e) => {
				// console.log(e.target);
				switch (e.target) {
					case this.up:
						console.log('up');
						this.scoreUp();
						break;
					case this.down:
						console.log('down');
						this.scoreDown();
						break;
				}
			},
			{ once: true }
		);

		// Reply/Edit functionality
		let edit = 'closed';
		let reply = 'closed';

		this.replyButton.addEventListener('click', () => {
			if (this.replyButton.innerHTML === 'Reply') {
				if (reply == 'closed') {
					this.addReply();
					reply = 'open';
				} else if (reply == 'open') {
					this.sectionCenter.removeChild(this.newReplyTextInput);
					reply = 'closed';
				}
			} else if (this.replyButton.innerHTML === 'Edit') {
				if (edit == 'closed') {
					this.textForEdit = document.createElement('textarea');
					this.textForEdit.classList.add('comment-edit-area');
					this.textForEdit.setAttribute('rows', 5);
					this.textForEdit.innerHTML = this.commentContentText.innerHTML;
					this.mainSection.removeChild(this.commentContentText);
					this.mainSection.appendChild(this.textForEdit);

					this.updateButton = document.createElement('h1');
					this.updateButton.classList.add('send-update-button');
					this.updateButton.innerHTML = 'UPDATE';
					this.mainSection.appendChild(this.updateButton);

					this.updateButton.addEventListener('click', () => {
						this.commentContentText.innerHTML = this.textForEdit.value;
						this.mainSection.removeChild(this.textForEdit);
						this.mainSection.removeChild(this.updateButton);
						this.mainSection.appendChild(this.commentContentText);
						edit = 'closed';
					});

					this.textForEdit.addEventListener('keypress', (e) => {
						if (e.key == 'Enter') {
							this.commentContentText.innerHTML = this.textForEdit.value;
							this.mainSection.removeChild(this.textForEdit);
							this.mainSection.removeChild(this.updateButton);
							this.mainSection.appendChild(this.commentContentText);
							edit = 'closed';
						}
					});
					edit = 'open';
				} else if (edit == 'open') {
					this.mainSection.removeChild(this.textForEdit);
					this.mainSection.removeChild(this.updateButton);
					this.mainSection.appendChild(this.commentContentText);
					edit = 'closed';
				}
			}
		});

		// Delete button functionality
		this.sectionCenter.addEventListener('mouseover', () => {
			if (this.deleteButton) {
				this.deleteButton.style.opacity = 1;
			}
		});

		this.sectionCenter.addEventListener('mouseout', () => {
			if (this.deleteButton) {
				this.deleteButton.style.opacity = 0;
			}
		});

		if (this.deleteButton) {
			this.deleteButton.addEventListener('click', (e) => {
				// console.log(e.target)
				if (this.type == 'comment') {
					const commentIndex = localData.comments.indexOf(this.comment);
					localData.comments.splice(commentIndex, 1);

					localStorage.setItem('data', JSON.stringify(localData));
					location.reload();
					console.log('Comment deleted');
				} else if (this.type == 'reply') {
					const parentIndex = localData.comments.findIndex((item) => item.id == this.comment.id);
					const replyIndex = localData.comments[parentIndex].replies.indexOf(this.comment);

					localData.comments[parentIndex].replies.splice(replyIndex, 1);
					localStorage.setItem('data', JSON.stringify(localData));
					location.reload();
				}
			});
		}

		// document.body.appendChild(this.sectionCenter);
		// document.body.insertBefore(this.sectionCenter, newComment);
		// this.addReply();
	}

	scoreUp() {
		this.comment.score++;
		localStorage.setItem('data', JSON.stringify(localData));
		this.currentScore.innerHTML = this.comment.score;
	}

	scoreDown() {
		this.comment.score--;
		localStorage.setItem('data', JSON.stringify(localData));
		this.currentScore.innerHTML = this.comment.score;
	}

	addReply() {
		const textInputFields = document.querySelectorAll('.new-reply-text-input');
		const allCurrentComments = document.querySelectorAll('.section-center');
		const oneComment = document.querySelector('.new-reply-text-input');

		if (textInputFields.length > 0) {
			allCurrentComments.forEach((comment) => {
				if (comment.lastChild == oneComment) {
					comment.removeChild(oneComment);
				}
			});
		}

		// New reply text input
		this.newReplyTextInput = document.createElement('div');
		this.newReplyTextInput.classList.add('new-reply-text-input');
		this.newReplyTextInput.classList.add('reply-container');
		this.newReplyTextInput.innerHTML = `
			<div class="new-reply-text-img-container">
				<img class="reply-user-img"src="${localData.currentUser.image.png}" alt="">
			</div>
			<div class="new-reply-text-area">
				<textarea name="comment" class="comment-text-area" id="comment-text-area" cols="30" rows="5">@${this.comment.user.username}
				</textarea>
				<div class="reply-buttons-container">
					<button type="submit" class="send-reply-button">REPLY</button>
					<button type="submit" class="cancel-reply-button">CANCEL</button>
				</div>
			</div>
		`;

		// Add whole thing to main
		this.sectionCenter.appendChild(this.newReplyTextInput);

		this.newReplySendButton = this.newReplyTextInput.querySelector('.send-reply-button');
		this.newReplyCancelButton = this.newReplyTextInput.querySelector('.cancel-reply-button');
		this.newReplyTextArea = this.newReplyTextInput.querySelector('.comment-text-area');

		this.newReplySendButton.addEventListener('click', () => {
			const replyText = this.newReplyTextArea.value;
			const fullReply = {
				id: this.comment.id,
				content: replyText,
				createdAt: 'Now',
				score: 0,
				user: localData.currentUser,
				replies: [],
			};

			if (fullReply.content && this.type == 'comment') {
				const commentIndex = localData.comments.indexOf(this.comment);
				localData.comments[commentIndex].replies.push(fullReply);
				this.sectionCenter.removeChild(this.newReplyTextInput);

				localStorage.setItem('data', JSON.stringify(localData));
				location.reload();
			} else if (fullReply.content && this.type == 'reply') {
				const parentIndex = localData.comments.findIndex((item) => item.id == this.comment.id);
				localData.comments[parentIndex].replies.push(fullReply);
				this.sectionCenter.removeChild(this.newReplyTextInput);

				localStorage.setItem('data', JSON.stringify(localData));
				location.reload();
			} else {
				this.newReplyTextArea.style.border = '2px solid red';
				this.newReplyTextArea.setAttribute('placeholder', 'Please enter a reply!');
			}
		});

		this.newReplyTextArea.addEventListener('keypress', (e) => {
			if (e.key == 'Enter') {
				const replyText = this.newReplyTextArea.value;
				const fullReply = {
					id: this.comment.id,
					content: replyText,
					createdAt: 'Now',
					score: 0,
					user: localData.currentUser,
					replies: [],
				};

				if (fullReply.content && this.type == 'comment') {
					const commentIndex = localData.comments.indexOf(this.comment);
					localData.comments[commentIndex].replies.push(fullReply);
					this.sectionCenter.removeChild(this.newReplyTextInput);

					localStorage.setItem('data', JSON.stringify(localData));
					location.reload();
				} else if (fullReply.content && this.type == 'reply') {
					const parentIndex = localData.comments.findIndex((item) => item.id == this.comment.id);
					localData.comments[parentIndex].replies.push(fullReply);
					this.sectionCenter.removeChild(this.newReplyTextInput);

					localStorage.setItem('data', JSON.stringify(localData));
					location.reload();
				} else {
					this.newReplyTextArea.style.border = '2px solid red';
					this.newReplyTextArea.setAttribute('placeholder', 'Please enter a reply!');
				}
			}
		});

		this.newReplyCancelButton.addEventListener('click', () => {
			this.sectionCenter.removeChild(this.newReplyTextInput);
		});
	}
}

// Render all comments and replies in sorted by highest score
function byScore(a, b) {
	return parseInt(a.score) - parseInt(b.score);
}

localData.comments
	.sort(byScore)
	.reverse()
	.forEach((comment) => {
		new addComment(comment, 'comment');
		comment.replies
			.sort(byScore)
			.reverse()
			.forEach((reply) => {
				new addComment(reply, 'reply');
			});
	});
