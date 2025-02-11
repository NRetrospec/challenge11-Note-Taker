// Initialize variables for the note-taking app
let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

// Initialize elements if on the notes page
if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Get notes from local storage
const getNotes = () => {
  return fetch('/api/notes')
    .then(response => response.json())
    .catch(err => console.error('Error fetching notes:', err));
};

// Save note to local storage
const saveNote = (note) => {
  return fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  })
  .then(response => response.json())
  .catch(err => console.error('Error saving note:', err));
};

// Render the active note
const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Handle note save
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
    id: Date.now()
  };
    
  saveNote(newNote);
  noteTitle.value = '';
  noteText.value = '';
  hide(saveNoteBtn);
  hide(clearBtn);
  renderNoteList();
  renderActiveNote();
};

// Handle note view
const handleNoteView = (e) => {
  e.preventDefault();
  const noteData = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  activeNote = noteData;
  renderActiveNote();
};

// Handle note delete
const handleNoteDelete = (e) => {
  e.stopPropagation();

  let noteToDelete;
  try {
    noteToDelete = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  } catch (error) {
    console.error('Error parsing note data:', error);
    return;
  }

  fetch(`/api/notes/${noteToDelete.id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }

    if (activeNote.id === noteToDelete.id) {
      activeNote = {};
    }

    renderNoteList();
  })
  .catch(err => {
    console.error('Error deleting note:', err);
  });
};

// Render the notes list
const renderNoteList = () => {
  getNotes().then(notes => {
    noteList.innerHTML = '';

    if (!Array.isArray(notes) || notes.length === 0) {
      noteList.append(createLi('No saved Notes', false));
    } else {
      notes.forEach(note => {
        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);
        noteList.append(li);
      });
    }
  }).catch(err => {
    console.error('Error rendering notes:', err);
    noteList.innerHTML = '';
    noteList.append(createLi('Error loading notes', false));
  });
};

// Create list item
const createLi = (text, delBtn = true) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item');

  const spanEl = document.createElement('span');
  spanEl.classList.add('list-item-title');
  spanEl.innerText = text;
  spanEl.addEventListener('click', handleNoteView);

  liEl.append(spanEl);

  if (delBtn) {
    const delBtnEl = document.createElement('i');
    delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
    delBtnEl.addEventListener('click', handleNoteDelete);
    liEl.append(delBtnEl);
  }

  return liEl;
};

// Handle new note view
const handleNewNoteView = () => {
  activeNote = {};
  show(saveNoteBtn);
  show(clearBtn);
  renderActiveNote();
}; 

// Handle clear form action
const handleClearForm = () => {
  noteTitle.value = '';
  noteText.value = '';
  hide(saveNoteBtn);
  hide(clearBtn);
  activeNote = {};
  renderActiveNote();
};

// Handle input event to enable display of buttons
const handleRenderBtns = () => {
  if (noteTitle.value || noteText.value) {
    show(saveNoteBtn);
    show(clearBtn);
  } else {
    hide(saveNoteBtn);
    hide(clearBtn);
  }
};

// Event listeners
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', handleClearForm);
  noteForm.addEventListener('input', handleRenderBtns);
}
