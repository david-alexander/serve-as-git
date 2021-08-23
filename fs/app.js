const fs = require('fs');
const path = require('path');
const git = require('@david-alexander/isomorphic-git');
const express = require('express');

const gitSettings = {
    fs,
    dir: `/repo/files`,
    gitdir: `/repo/.git`
};

async function update()
{
    let paths = await git.statusMatrix({...gitSettings});
    let anythingAdded = false;

    for (let [path, head, workdir, stage] of paths)
    {
        if (workdir == 2) // different from HEAD
        {
            await git.add({ ...gitSettings, filepath: path });
            anythingAdded = true;
        }
    }

    if (anythingAdded)
    {
        await git.commit({
            ...gitSettings,
            message: 'Commit',
            author: {
                name: 'Test',
                email: 'test@example.com'
            }
        });

        await git.updateServerInfo({...gitSettings});
    }
}

async function main()
{
    await git.init({...gitSettings});

    const app = express();
    app.use('/info/refs', async (req, res, next) => {
        await update();
        next();
    });
    app.use(express.static(gitSettings.gitdir));
    app.listen(80, () => {
        
    });
}

main();
