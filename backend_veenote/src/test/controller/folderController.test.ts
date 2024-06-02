import { createFolder } from '../../controller/folderController';
import Folder from '../../model/folderModel';

describe('createFolder', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {
                folderName: 'newFolder'
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

    it('should create a folder and return 201', async () => {
        const mockFolder = {
            save: jest.fn().mockResolvedValue({ folderName: 'newFolder' })
        };
        jest.spyOn(Folder.prototype, 'save').mockImplementationOnce(mockFolder.save);

        await createFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ folderName: 'newFolder' });
    });

    it('should return 400 if folderName is missing', async () => {
        req.body = {};

        await createFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ "Error": "Missing folder name" });
    });

    it('should handle errors and return 500', async () => {
        const mockFolder = {
            save: jest.fn().mockRejectedValue(new Error('Database error'))
        };
        jest.spyOn(Folder.prototype, 'save').mockImplementationOnce(mockFolder.save);

        await createFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            "Error": "Error Creating A Folder",
            "Details": "Database error"
        });
    });

    it('should return 409 if folder already exists', async () => {
        const mockFolder = {
            save: jest.fn().mockRejectedValue(new Error('E11000'))
        };
        jest.spyOn(Folder.prototype, 'save').mockImplementationOnce(mockFolder.save);

        await createFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            "Error": "Folder Already Exists",
            "Details": 'E11000'
        });
    });
});

import { getRootFolder } from '../../controller/folderController';
import Folder from '../../model/folderModel';

describe('getRootFolder', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            user: {
                id: 'userId'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should return 200 and the root folder', async () => {
        jest.spyOn(Folder, 'find').mockResolvedValue([{ folderName: 'rootFolder' }]);

        await getRootFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ folderName: 'rootFolder' }]);
    });

    it('should return 404 if no root folder found', async () => {
        jest.spyOn(Folder, 'find').mockResolvedValue([]);

        await getRootFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ "Error": "Folder Not Found" });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Folder, 'find').mockRejectedValue(new Error('Database error'));

        await getRootFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            "Error": "Getting Folder",
            "Details": "Database error"
        });
    });
});

import { getAllFolders } from '../../controller/folderController';
import Folder from '../../model/folderModel';

describe('getAllFolders', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            user: {
                id: 'userId'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should return 200 and all folders', async () => {
        jest.spyOn(Folder, 'find').mockResolvedValue([{ folderName: 'folder1' }, { folderName: 'folder2' }]);

        await getAllFolders(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Folders retrieved successfully",
            data: [{ folderName: 'folder1' }, { folderName: 'folder2' }]
        });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Folder, 'find').mockRejectedValue(new Error('Database error'));

        await getAllFolders(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error retrieving folders",
            details: "Database error"
        });
    });
});

import { getFolder } from '../../controller/folderController';
import Folder from '../../model/folderModel';

describe('getFolder', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                folderName: 'testFolder'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should return 200 and the folder', async () => {
        jest.spyOn(Folder, 'findOne').mockResolvedValue({ folderName: 'testFolder' });

        await getFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Folder retrieved successfully",
            data: { folderName: 'testFolder' }
        });
    });

    it('should return 404 if folder not found', async () => {
        jest.spyOn(Folder, 'findOne').mockResolvedValue(null);

        await getFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Folder not found" });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Folder, 'findOne').mockRejectedValue(new Error('Database error'));

        await getFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error retrieving folder",
            details: "Database error"
        });
    });
});

import { deleteFolder } from '../../controller/folderController';
import Folder from '../../model/folderModel';

describe('deleteFolder', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                folderId: 'folderId'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should delete a folder and return 200', async () => {
        jest.spyOn(Folder, 'findOneAndDelete').mockResolvedValue({ folderName: 'deletedFolder' });

        await deleteFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ deleted: { folderName: 'deletedFolder' } });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Folder, 'findOneAndDelete').mockRejectedValue(new Error('Database error'));

        await deleteFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error deleting folder",
            details: "Database error"
        });
    });
});


import { deleteFolder } from '../../controller/folderController';
import Folder from '../../model/folderModel';

describe('deleteFolder', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                folderId: 'folderId'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should delete a folder and return 200', async () => {
        jest.spyOn(Folder, 'findOneAndDelete').mockResolvedValue({ folderName: 'deletedFolder' });

        await deleteFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ deleted: { folderName: 'deletedFolder' } });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Folder, 'findOneAndDelete').mockRejectedValue(new Error('Database error'));

        await deleteFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error deleting folder",
            details: "Database error"
        });
    });
});

import { getNotesForFolder } from '../../controller/folderController';
import Folder from '../../model/folderModel';
import Note from '../../model/noteModel';

describe('getNotesForFolder', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                folderId: 'folderId'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should return 200 and notes for the folder', async () => {
        const mockNotes = [
            { fileName: 'note1', _id: 'noteId1', content: 'content1', createdAt: 'date1', updatedAt: 'date2' },
            { fileName: 'note2', _id: 'noteId2', content: 'content2', createdAt: 'date3', updatedAt: 'date4' }
        ];
        jest.spyOn(Folder, 'findOne').mockResolvedValue({ _id: 'folderId', folderName: 'testFolder', isRoot: true });
        jest.spyOn(Note, 'find').mockResolvedValue(mockNotes);

        await getNotesForFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            folder: {
                folderId: 'folderId',
                folderName: 'testFolder',
                isRoot: true,
                notes: [
                    { fileName: 'note1', id: 'noteId1', content: 'content1', createdAt: 'date1', updatedAt: 'date2' },
                    { fileName: 'note2', id: 'noteId2', content: 'content2', createdAt: 'date3', updatedAt: 'date4' }
                ]
            }
        });
    });

    it('should return 404 if folder not found', async () => {
        jest.spyOn(Folder, 'findOne').mockResolvedValue(null);

        await getNotesForFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Folder not found" });
    });

    it('should handle errors and return 500', async () => {
        jest.spyOn(Folder, 'findOne').mockRejectedValue(new Error('Database error'));

        await getNotesForFolder(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});
