import { createNote } from '../../controller/noteController';
import Note from '../../model/noteModel';
import User from '../../model/userModel';
import getFormattedDateTime from '../../utilities/dateTimeGenerator';

describe('createNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {
                content: 'Test content'
            },
            params: {
                folderId: 'folderId'
            },
            user: {
                id: 'userId'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should create a note and return 201', async () => {
        const mockNote = {
            save: jest.fn().mockResolvedValue({ fileName: 'default-2023-01-01-00-00-00', content: 'Test content' })
        };
        jest.spyOn(Note.prototype, 'save').mockImplementationOnce(mockNote.save);
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });

        await createNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Note created successfully", data: { fileName: 'default-2023-01-01-00-00-00', content: 'Test content' } });
    });

    it('should return 400 if content is missing', async () => {
        req.body = {};

        await createNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errorCode: 'MissingContent',
            errorMessage: "content is a required field",
            errorDetails: "The 'content' field is not present in the request body."
        });
    });

    it('should return 404 if user not found', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(null);

        await createNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note.prototype, 'save').mockRejectedValue(new Error('Database error'));
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });

        await createNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error creating note",
            details: "Database error"
        });
    });

    it('should return 409 if note with same fileName exists', async () => {
        const mockNote = {
            save: jest.fn().mockRejectedValue({ code: 11000 })
        };
        jest.spyOn(Note.prototype, 'save').mockImplementationOnce(mockNote.save);
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });

        await createNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            errorCode: 'DuplicateFileName',
            errorMessage: "Note with the provided fileName already exists",
            errorDetails: "A note with the same fileName already exists in the database. Please use a unique fileName."
        });
    });
});


import { createNote } from '../../controller/noteController';
import Note from '../../model/noteModel';
import User from '../../model/userModel';
import getFormattedDateTime from '../../utilities/dateTimeGenerator';

describe('createNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {
                content: 'Test content'
            },
            params: {
                folderId: 'folderId'
            },
            user: {
                id: 'userId'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should create a note and return 201', async () => {
        const mockNote = {
            save: jest.fn().mockResolvedValue({ fileName: 'default-2023-01-01-00-00-00', content: 'Test content' })
        };
        jest.spyOn(Note.prototype, 'save').mockImplementationOnce(mockNote.save);
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });

        await createNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Note created successfully", data: { fileName: 'default-2023-01-01-00-00-00', content: 'Test content' } });
    });

    it('should return 400 if content is missing', async () => {
        req.body = {};

        await createNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errorCode: 'MissingContent',
            errorMessage: "content is a required field",
            errorDetails: "The 'content' field is not present in the request body."
        });
    });

    it('should return 404 if user not found', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(null);

        await createNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note.prototype, 'save').mockRejectedValue(new Error('Database error'));
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });

        await createNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error creating note",
            details: "Database error"
        });
    });

    it('should return 409 if note with same fileName exists', async () => {
        const mockNote = {
            save: jest.fn().mockRejectedValue({ code: 11000 })
        };
        jest.spyOn(Note.prototype, 'save').mockImplementationOnce(mockNote.save);
        jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'userId' });

        await createNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            errorCode: 'DuplicateFileName',
            errorMessage: "Note with the provided fileName already exists",
            errorDetails: "A note with the same fileName already exists in the database. Please use a unique fileName."
        });
    });
});


import { updateNote } from '../../controller/noteController';
import Note from '../../model/noteModel';

describe('updateNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                noteId: 'noteId'
            },
            body: {
                content: 'Updated content'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should update a note and return 200', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue({
            _id: 'noteId',
            content: 'Updated content',
            save: jest.fn()
        });

        await updateNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note updated successfully"
        });
    });

    it('should return 404 if note not found', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue(null);

        await updateNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note not found"
        });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockRejectedValue(new Error('Database error'));

        await updateNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error updating note",
            details: "Database error"
        });
    });
});


import { updateNote } from '../../controller/noteController';
import Note from '../../model/noteModel';

describe('updateNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                noteId: 'noteId'
            },
            body: {
                content: 'Updated content'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should update a note and return 200', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue({
            _id: 'noteId',
            content: 'Updated content',
            save: jest.fn()
        });

        await updateNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note updated successfully"
        });
    });

    it('should return 404 if note not found', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue(null);

        await updateNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note not found"
        });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockRejectedValue(new Error('Database error'));

        await updateNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error updating note",
            details: "Database error"
        });
    });
});


import { updateNote } from '../../controller/noteController';
import Note from '../../model/noteModel';

describe('updateNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                noteId: 'noteId'
            },
            body: {
                content: 'Updated content'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should update a note and return 200', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue({
            _id: 'noteId',
            content: 'Updated content',
            save: jest.fn()
        });

        await updateNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note updated successfully"
        });
    });

    it('should return 404 if note not found', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockResolvedValue(null);

        await updateNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note not found"
        });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note, 'findOneAndUpdate').mockRejectedValue(new Error('Database error'));

        await updateNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message:
             "Error updating note",
            details: "Database error"
        });
    });
});

import { downloadNote } from '../../controller/noteController';
import Note from '../../model/noteModel';

describe('downloadNote', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                noteId: 'noteId'
            }
        };
        res = {
            setHeader: jest.fn(),
            send: jest.fn(),
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should download the note content', async () => {
        jest.spyOn(Note, 'findOne').mockResolvedValue({ _id: 'noteId', content: 'Test content', fileName: 'note1' });

        await downloadNote(req as Request, res as Response);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=note1.txt');
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
        expect(res.send).toHaveBeenCalledWith('Test content');
    });

    it('should return 404 if note not found', async () => {
        jest.spyOn(Note, 'findOne').mockResolvedValue(null);

        await downloadNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Note not found"
        });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Note, 'findOne').mockRejectedValue(new Error('Database error'));

        await downloadNote(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error retrieving note content",
            details: "Database error"
        });
    });
});

