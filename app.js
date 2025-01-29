const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'links.json');

// Utility functions
async function readLinksFile() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeLinksFile(links) {
    await fs.writeFile(DATA_FILE, JSON.stringify(links, null, 2));
}

async function getNextId(links) {
    if (links.length === 0) return '0001';
    const maxId = Math.max(...links.map(link => parseInt(link.id)));
    return String(maxId + 1).padStart(4, '0');
}

// Routes
app.get('/links', async (req, res) => {
    try {
        const links = await readLinksFile();
        res.json(links);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch links' });
    }
});

app.post('/links', async (req, res) => {
    try {
        const { url, category, tags } = req.body;
        if (!url || !category) {
            return res.status(400).json({ error: 'URL and category are required' });
        }

        const links = await readLinksFile();
        const newLink = {
            id: await getNextId(links),
            url,
            category,
            tags: tags || []
        };

        links.push(newLink);
        await writeLinksFile(links);
        res.status(201).json(newLink);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add link' });
    }
});

app.post('/links/bulk', async (req, res) => {
    try {
        const { links: newLinks } = req.body;
        if (!Array.isArray(newLinks)) {
            return res.status(400).json({ error: 'Links array is required' });
        }

        const links = await readLinksFile();
        let nextId = parseInt(await getNextId(links));

        const processedLinks = newLinks.map(link => ({
            id: String(nextId++).padStart(4, '0'),
            url: link.url,
            category: link.category,
            tags: link.tags || []
        }));

        links.push(...processedLinks);
        await writeLinksFile(links);
        res.status(201).json(processedLinks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to bulk add links' });
    }
});

app.put('/links/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { url, category, tags } = req.body;
        const links = await readLinksFile();
        
        const linkIndex = links.findIndex(link => link.id === id);
        if (linkIndex === -1) {
            return res.status(404).json({ error: 'Link not found' });
        }

        links[linkIndex] = {
            ...links[linkIndex],
            url: url || links[linkIndex].url,
            category: category || links[linkIndex].category,
            tags: tags || links[linkIndex].tags
        };

        await writeLinksFile(links);
        res.json(links[linkIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update link' });
    }
});

app.delete('/links/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const links = await readLinksFile();
        
        const filteredLinks = links.filter(link => link.id !== id);
        if (filteredLinks.length === links.length) {
            return res.status(404).json({ error: 'Link not found' });
        }

        await writeLinksFile(filteredLinks);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete link' });
    }
});

app.get('/links/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { tags } = req.query;
        const links = await readLinksFile();

        let filteredLinks = links.filter(link => link.category === category);
        
        if (tags) {
            const tagArray = tags.split(',');
            filteredLinks = filteredLinks.filter(link => 
                tagArray.every(tag => link.tags.includes(tag))
            );
        }

        res.json(filteredLinks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch links by category' });
    }
});

app.get('/links/tags/:tags', async (req, res) => {
    try {
        const tags = req.params.tags.split(',');
        const links = await readLinksFile();

        const filteredLinks = links.filter(link => 
            tags.every(tag => link.tags.includes(tag))
        );

        res.json(filteredLinks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch links by tags' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});