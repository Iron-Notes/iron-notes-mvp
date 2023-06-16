# IronNotes Note-Taking App

A simple note-taking app developed using JavaScript Express, Bootstrap CSS, and Handlebars for rendering dynamic HTML pages. 
The app allows users to create a user profile, change their username and password, create notes with optional image attachments, edit notes, and delete notes. 
Deleted notes are moved to the trash where they can be restored or permanently deleted. 
The app supports light and dark mode and includes a search feature to find notes by keywords. 
It is also responsive and optimized for mobile screens.

## Features

- User authentication: Users can create a user profile and log in to the app.
- User profile management: Users can change their username and password.
- Note creation: Users can create new notes with a title, description, optional image attachment.
- Note listing: Users can view their active notes in a card format.
- Note editing: Users can edit the details of their notes, including the title, description, image.
- Note deletion: Users can soft-delete notes, moving them to the trash.
- Trash view: Users can view their deleted notes in the trash.
- Note restoration: Users can restore deleted notes, moving them back to the active notes list.
- Note archiving: Users can archive notes, marking them as archived.
- Archive view: Users can view their archived notes.
- Empty trash: Users can permanently delete all notes in the trash.
- Search notes: Users can search for notes using keywords.
- Light and dark mode: Users can switch between light and dark mode themes.

## Usage

1. Register a new user account or log in to an existing account.
2. Create notes by providing the required information such as title and description.
3. Optionally, attach an image for the note.
4. View and manage your active notes in the main note list.
5. Edit notes to update their details or make changes.
6. Soft-delete notes by moving them to the trash.
7. Restore deleted notes from the trash to make them active again.
8. Archive notes to mark them as archived and view them separately.
9. Empty the trash to permanently delete all notes in the trash.
10. Switch between light and dark mode themes to customize the app's appearance.
11. Search for notes using keywords to quickly find specific notes.

## Technologies Used

- JavaScript
- Express
- Bootstrap CSS
- Handlebars
- MongoDB
- Cloudinary (for image uploads)

## Code Structure

The main logic of the app can be found in the `notes.routes.js` file. It contains the following routes:

- `/notes/list`: Retrieves and renders active notes, filtered by the current user and keyword.
- `/notes/trash`: Retrieves and renders deleted notes in the trash, filtered by the current user and keyword.
- `/notes/archive`: Retrieves and renders archived notes, filtered by the current user and keyword.
- `/notes/create`: Creates a new note by processing the provided information and optionally uploading an image.
- `/notes/:noteId/delete`: Soft-deletes a note by updating its status to "deleted".
- `/notes/:noteId/archive`: Archives a note by updating its status to "archived".
- `/notes/:noteId/restore`: Restores an archived or deleted note by updating its status to "active".
- `/notes/restoreArchived`: Restores all archived notes by setting their status to "active".
- `/notes/:noteId/deleteone`: Permanently deletes a single note from the trash.
- `/notes/emptyTrash`: Permanently deletes all notes in the trash.
- `/notes/:noteId/edit`: Renders the note details view for editing.
- `/notes/:noteId/edit`: Updates the note details with the provided information, including optional image upload.

The routes utilize various middleware functions for user authentication and file uploading.

## Contributing

Contributions to the note-taking app are welcome!
