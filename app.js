import data from './data.json' assert { type: 'json' };

// history.scrollRestoration = 'manual';

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
		// id: localData.comments.length + 1,
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
			// id: localData.comments.length + 1,
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

		// Comment | Reply
		switch (type) {
			case 'comment':
				// Comment Container
				this.commentContainer = document.createElement('div');
				this.sectionCenter.appendChild(this.commentContainer);
				this.commentContainer.classList.add('comment-container');

				// Score
				this.score = document.createElement('div');
				this.commentContainer.appendChild(this.score);
				this.score.classList.add('score');
				break;
			case 'reply':
				// Reply
				this.replyContainer = document.createElement('div');
				this.sectionCenter.appendChild(this.replyContainer);
				this.replyContainer.classList.add('reply-container');

				// Score
				this.score = document.createElement('div');
				this.replyContainer.appendChild(this.score);
				this.score.classList.add('score');
		}

		// Score button up
		this.scoreBtnContainer = document.createElement('div');
		this.score.appendChild(this.scoreBtnContainer);
		this.scoreBtnContainer.classList.add('score-btn-container');

		this.up = document.createElement('h1');
		this.scoreBtnContainer.appendChild(this.up);
		this.up.classList.add('up');
		this.up.innerHTML = '+';

		// Current score
		this.currentScore = document.createElement('h1');
		this.score.appendChild(this.currentScore);
		this.currentScore.classList.add('current-score');
		this.currentScore.innerHTML = this.comment.score;

		// Score button down
		this.scoreBtnContainer = document.createElement('div');
		this.scoreBtnContainer.classList.add('score-btn-container');
		this.score.appendChild(this.scoreBtnContainer);

		this.down = document.createElement('h1');
		this.down.classList.add('down');
		this.down.innerHTML = '-';
		this.scoreBtnContainer.appendChild(this.down);

		// Main Section
		switch (type) {
			case 'comment':
				this.mainSection = document.createElement('div');
				this.mainSection.classList.add('main-section');
				this.commentContainer.appendChild(this.mainSection);
				break;
			case 'reply':
				this.mainSection = document.createElement('div');
				this.mainSection.classList.add('main-section');
				this.replyContainer.appendChild(this.mainSection);
				break;
		}

		// User
		this.user = document.createElement('div');
		this.user.classList.add('user');
		this.mainSection.appendChild(this.user);

		// User Info
		this.userInfo = document.createElement('div');
		this.userInfo.classList.add('user-info');
		this.user.appendChild(this.userInfo);

		// User Image container
		this.userImgContainer = document.createElement('div');
		this.userImgContainer.classList.add('user-img-container');
		this.userInfo.appendChild(this.userImgContainer);

		// User Image
		this.userImg = document.createElement('img');
		this.userImg.classList.add('user-img');
		this.userImg.src = comment.user.image.png;
		this.userImgContainer.appendChild(this.userImg);

		// Username
		this.username = document.createElement('h2');
		this.username.innerHTML = this.comment.user.username;
		this.userInfo.appendChild(this.username);

		// Created at
		this.createdAt = document.createElement('h2');
		this.createdAt.classList.add('created-at');
		this.createdAt.innerHTML = comment.createdAt;
		this.userInfo.appendChild(this.createdAt);

		// Reply/Delete buttons container
		this.replyDeleteButtonsContainer = document.createElement('div');
		this.replyDeleteButtonsContainer.classList.add(
			'reply-delete-buttons-container'
		);
		this.user.appendChild(this.replyDeleteButtonsContainer);

		// Delete button only for current users comments
		if (localData.currentUser.username === this.comment.user.username) {
			// Delete button
			this.deleteButton = document.createElement('h1');
			this.deleteButton.classList.add('delete');
			this.deleteButton.innerHTML = 'Delete';
			this.replyDeleteButtonsContainer.appendChild(this.deleteButton);
		}

		if (localData.currentUser.username === this.comment.user.username) {
			// Reply button
			this.replyButton = document.createElement('h1');
			this.replyButton.classList.add('reply');
			this.replyButton.innerHTML = 'Edit';
			this.replyDeleteButtonsContainer.appendChild(this.replyButton);
		} else {
			this.replyButton = document.createElement('h1');
			this.replyButton.classList.add('reply');
			this.replyButton.innerHTML = 'Reply';
			this.replyDeleteButtonsContainer.appendChild(this.replyButton);
		}

		// this.replyButton = document.createElement('h1');
		// this.user.appendChild(this.replyButton);
		// this.replyButton.classList.add('reply');
		// this.replyButton.innerHTML = 'Reply';

		// Comment content
		this.commentContentText = document.createElement('p');
		this.commentContentText.classList.add('comment-content');
		this.commentContentText.innerHTML = comment.content;
		this.mainSection.appendChild(this.commentContentText);

		// Bind this to all functions
		this.scoreUp = this.scoreUp.bind(this);
		this.scoreDown = this.scoreDown.bind(this);
		this.addReply = this.addReply.bind(this);
		// this.pushReply = this.pushReply.bind(this);

		// Score interactivity
		this.score.addEventListener(
			'click',
			(e) => {
				// console.log(e.target);
				switch (e.target) {
					case this.up:
						this.scoreUp();
						break;
					case this.down:
						this.scoreDown();
						break;
				}
			},
			{ once: true }
		);

		// Reply/Edit interactivity
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
					console.log('edit');
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
			this.deleteButton.addEventListener('click', () => {
				if (this.type == 'comment') {
					const indexOfObjectToBeDeleted = localData.comments.indexOf(
						this.comment
					);
					const commentObjectToBeDeletedFrom = localData.comments;
					commentObjectToBeDeletedFrom.splice(indexOfObjectToBeDeleted, 1);
					localStorage.setItem('data', JSON.stringify(localData));
					location.reload();
					console.log('Comment deleted');
				} else if (this.type == 'reply') {
					const parentObject = localData.comments.find((comment) => {
						return comment.id == this.comment.id;
					});

					const indexOfObjectToBeDeleted = localData.comments[
						localData.comments.indexOf(parentObject)
					].replies.indexOf(this.comment);
					console.log(indexOfObjectToBeDeleted);

					const commentObjectToBeDeletedFrom =
						localData.comments[localData.comments.indexOf(parentObject)]
							.replies;

					// console.log(commentObjectToBeDeletedFrom);
					console.log(parentObject);

					commentObjectToBeDeletedFrom.splice(indexOfObjectToBeDeleted, 1);
					localStorage.setItem('data', JSON.stringify(localData));
					location.reload();
					console.log('Reply deleted');
				}
			});
		}

		// document.body.appendChild(this.sectionCenter);
		document.body.insertBefore(this.sectionCenter, newComment);
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

		// Reply text input image container
		this.newReplyImgContainer = document.createElement('div');
		this.newReplyImgContainer.classList.add('new-reply-text-img-container');
		this.newReplyTextInput.appendChild(this.newReplyImgContainer);

		// Reply user image
		this.newReplyUserImage = document.createElement('img');
		this.newReplyUserImage.classList.add('reply-user-img');
		this.newReplyUserImage.src = localData.currentUser.image.png;
		this.newReplyImgContainer.appendChild(this.newReplyUserImage);

		// Reply textarea container
		this.newReplyTextAreaContainer = document.createElement('div');
		this.newReplyTextAreaContainer.classList.add('new-reply-text-area');
		this.newReplyTextInput.appendChild(this.newReplyTextAreaContainer);

		// Reply text area
		this.newReplyTextArea = document.createElement('textarea');
		this.newReplyTextArea.setAttribute('rows', '5');
		this.newReplyTextArea.classList.add('comment-text-area');
		this.newReplyTextArea.innerHTML = `@${this.comment.user.username}`;
		this.newReplyTextAreaContainer.appendChild(this.newReplyTextArea);

		// Button container
		this.buttonContainer = document.createElement('div');
		this.buttonContainer.classList.add('reply-buttons-container');
		this.newReplyTextAreaContainer.appendChild(this.buttonContainer);

		// Reply send button
		this.newReplySendButton = document.createElement('button');
		this.newReplySendButton.setAttribute('type', 'submit');
		this.newReplySendButton.classList.add('send-reply-button');
		this.newReplySendButton.innerHTML = 'REPLY';
		this.buttonContainer.appendChild(this.newReplySendButton);

		// Reply cancel button
		this.newReplyCancelButton = document.createElement('button');
		this.newReplyCancelButton.classList.add('cancel-reply-button');
		this.newReplyCancelButton.innerHTML = 'CANCEL';
		this.buttonContainer.appendChild(this.newReplyCancelButton);

		// Add whole thing to main
		this.sectionCenter.appendChild(this.newReplyTextInput);

		this.newReplySendButton.addEventListener('click', () => {
			const replyText = this.newReplyTextArea.value;
			const fullReply = {
				// id: localData.comments.length + 1,

				id: this.comment.id,
				content: replyText,
				createdAt: 'Now',
				score: 0,
				user: localData.currentUser,
				replies: [],
			};

			if (fullReply.content && this.type == 'comment') {
				const indexOfCommentBeingRepliedTo = localData.comments.indexOf(
					this.comment
				);

				localData.comments[indexOfCommentBeingRepliedTo].replies.push(
					fullReply
				);

				this.sectionCenter.removeChild(this.newReplyTextInput);
				localStorage.setItem('data', JSON.stringify(localData));
				location.reload();
			} else if (fullReply.content && this.type == 'reply') {
				const parentObject = localData.comments.find((comment) => {
					return comment.id == this.comment.id;
				});

				localData.comments[
					localData.comments.indexOf(parentObject)
				].replies.push(fullReply);

				this.sectionCenter.removeChild(this.newReplyTextInput);
				localStorage.setItem('data', JSON.stringify(localData));
				location.reload();
			} else {
				this.newReplyTextArea.style.border = '2px solid red';
				this.newReplyTextArea.setAttribute(
					'placeholder',
					'Please enter a reply!'
				);
			}
		});

		this.newReplyTextArea.addEventListener('keypress', (e) => {
			if (e.key == 'Enter') {
				const replyText = this.newReplyTextArea.value;
				const fullReply = {
					// id: localData.comments.length + 1,

					id: this.comment.id,
					content: replyText,
					createdAt: 'Now',
					score: 0,
					user: localData.currentUser,
					replies: [],
				};

				if (fullReply.content && this.type == 'comment') {
					const indexOfCommentBeingRepliedTo = localData.comments.indexOf(
						this.comment
					);

					localData.comments[indexOfCommentBeingRepliedTo].replies.push(
						fullReply
					);

					this.sectionCenter.removeChild(this.newReplyTextInput);
					localStorage.setItem('data', JSON.stringify(localData));
					location.reload();
				} else if (fullReply.content && this.type == 'reply') {
					const parentObject = localData.comments.find((comment) => {
						return comment.id == this.comment.id;
					});

					localData.comments[
						localData.comments.indexOf(parentObject)
					].replies.push(fullReply);

					this.sectionCenter.removeChild(this.newReplyTextInput);
					localStorage.setItem('data', JSON.stringify(localData));
					location.reload();
				} else {
					this.newReplyTextArea.style.border = '2px solid red';
					this.newReplyTextArea.setAttribute(
						'placeholder',
						'Please enter a reply!'
					);
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
