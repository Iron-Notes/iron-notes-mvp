# MVP (must-have)
- User: User can register and login to user profile (using bcrypt)
- Note: User can create a new note
- Note: User can edit an existing note
- Note: User  can delete an existing note
- Note: Route protection is in place
- User & Notes: Validation in frontend and backend in place
- Bootstrap: Basic styling in place using Bootstrap
- Deployment: Site is deployed to adaptable.io

# Nice-to-Have Features
- User: User can change user details
- Search: User can search notes for keywords
- Filter: User can filter by note category
- Sorting: User can sort notes by date, title (A-Z) 
- Styling: More detailed stylig with Bootstratp and SASS customization (buttons, colors, animations)
- Responsiveness: Site is responsive
- Notes: Notes can be changed on the same page
- Theme: Dark/Light these can be switched (ref. Bootstrap)
- Nodemailer: Send e-mails to user
- Cloudinary: Handle image upload via Cloudinary
- E-mail Hyperlink: User can type e-mails in a note and directs to e-mail client, same with phone numbers and websites

# Who does what?
- Models (Marco)
- Routes
    - Auth.routes (Fabio)
    - Notes.routes (Marco) 
- Views (tbd next week)
    - Layout.hbs - navigation bar (...)
    - Index.hbs - product landing page (...)
    - Signup.hbs - signup form with all user details, e-mail, pw, name (...)
    - Login.hbs - login form with e-mail and pw (...)
    - Note-create.hbs - input form with all Note details and Save button (...)
    - Note-list.hbs - display all notes as cards (Bootstrap) and delete, later also with search, filter, etc. (...)
    - Note-details-edit.hbs - display note with body content, and user can edit + delete in this view (...)
