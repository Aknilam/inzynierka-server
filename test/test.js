/**
 *  run server:
 *    $ node server.js
 *  run tests from `.\test` directory:
 *    $ node_modules\.bin\mocha.cmd
 */

var request = require('supertest'),
    server = request.agent('http://localhost:1337'),
    assert = require('assert');

describe('init.js', function() {
    it('GET /api/generateDatabase', function(done) {
        server.get('/api/generateDatabase')
            .expect(200)
            .end(function(err, res){
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe('hello.js', function() {
    it('GET /api/ping', function(done) {
        server.get('/api/ping')
            .expect(200)
            .expect('pong')
            .end(function(err, res) {
                if (err) {
                    return done(err)
                };
                done();
            });
    });
});

describe('login.js', function() {
    var username = 'test';
    var username2 = 'test2';
    it('POST /api/register', function(done) {
        server.post('/api/register')
            .send({username: username, password: username})
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                assert.equal(res.body.username, username);
                assert.equal(res.body.id, 1);
                done();
            });
    });

    it('POST /api/register', function(done) {
        server.post('/api/register')
            .send({username: username, password: username})
            .expect(400)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('POST /api/register', function(done) {
        server.post('/api/register')
            .send({username: username2, password: username2})
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                assert.equal(res.body.username, username2);
                assert.equal(res.body.id, 2);
                done();
            });
    });

    it('POST /api/login', function(done) {
        server.post('/api/login')
            .send({username: username, password: username + 'a'})
            .expect(403)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('POST /api/login', function(done) {
        server.post('/api/login')
            .send({username: username + 'a', password: username})
            .expect(403)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('POST /api/login', function(done) {
        server.post('/api/login')
            .send({username: username + 'a', password: username + 'a'})
            .expect(403)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('POST /api/login', function(done) {
        server.post('/api/login')
            .send({username: username, password: username})
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                assert.equal(res.body.username, username);
                assert.equal(res.body.id, 1);
                done();
            });
    });

    it('GET /api/logout', function(done) {
        server.get('/api/logout')
            .send()
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('GET /api/logout', function(done) {
        server.get('/api/logout')
            .send({username: username, password: username})
            .expect(401)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe('project.js', function() {
    it('POST /api/projects/add', function(done) {
        var username = 'test';

        server.post('/api/login').send({username: username, password: username}).end(function(err, res1) {
            var name = 'name',
                description = 'description';

            server.post('/api/projects/add')
                .send({name: name, description: description})
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.accessible, true);
                    assert.equal(res.body.description, description);
                    assert.equal(res.body.editable, true);
                    assert.ok(res.body.createdAt);
                    assert.ok(res.body.folderName);
                    assert.equal(res.body.id, 1);
                    assert.equal(res.body.name, name);
                    assert.equal(res.body.owner, res1.body.id);
                    assert.ok(res.body.updatedAt);
                    assert.equal(res.body.lat, 0);
                    assert.equal(res.body.lng, 0);
                    assert.equal(res.body.zoom, 1);
                    done();
                });
        });
    });

    it('GET /api/projects/enter/:id', function(done) {
        var username = 'test',
            name = 'name',
            description = 'description';

        server.post('/api/login').send({username: username, password: username}).end(function(err, res1) {
        server.post('/api/projects/add').send({name: name, description: description}).end(function(err, res2) {
            server.get('/api/projects/enter/' + res2.body.id).send()
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.owner, username);
                    assert.equal(res.body.members.length, 1);
                    assert.equal(res.body.members[0].username, username);
                    assert.equal(res.body.members[0].role, 'owner');
                    assert.equal(res.body.members[0].id, res1.body.id);
                    assert.equal(res.body.amIAdmin, true);
                    done();
                });
        });
        });
    });

    it('GET /projects/all', function(done) {
        var username = 'test';

        server.post('/api/login').send({username: username, password: username}).end(function(err, res1) {
            server.get('/api/projects/all').send()
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.length, 2);
                    done();
                });
        });
    });

    it('POST /projects/join', function(done) {
        var username = 'test',
            username2 = 'test2';

        server.post('/api/login').send({username: username, password: username}).end(function(err, res1) {
        server.get('/api/projects/all').send().end(function(err, res2) {
        server.get('/api/logout').send().end(function(err, res3) {
        server.post('/api/login').send({username: username2, password: username2}).end(function(err, res4) {
            server.post('/api/projects/join').send({accessCode: res2.body[0].accessCode})
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.id, 1);
                    done();
                });
        });
        });
        });
        });
    });

    it('PUT /api/projects/giveadmin/:id', function(done) {
        var username = 'test',
            username2 = 'test2',
            name = 'name',
            description = 'description';

        server.post('/api/login').send({username: username, password: username}).end(function(err, res1) {
        server.get('/api/projects/enter/' + 1).send().end(function(err, res2) {
            server.put('/api/projects/giveadmin/' + 2).send()
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.username, username2);
                    assert.equal(res.body.role, 'admin');
                    assert.equal(res.body.id, 2);
                    done();
                });
        });
        });
    });

    it('GET /api/projects/enter/:id check second admin', function(done) {
        var username = 'test',
            username2 = 'test2',
            name = 'name',
            description = 'description';

        server.post('/api/login').send({username: username, password: username}).end(function(err, res1) {
            server.get('/api/projects/enter/' + 1).send()
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.owner, username);
                    assert.equal(res.body.members.length, 2);
                    assert.equal(res.body.members[0].username, username);
                    assert.equal(res.body.members[0].role, 'owner');
                    assert.equal(res.body.members[0].id, res1.body.id);
                    assert.equal(res.body.members[1].username, username2);
                    assert.equal(res.body.members[1].role, 'admin');
                    assert.equal(res.body.members[1].id, 2);
                    assert.equal(res.body.amIAdmin, true);
                    done();
                });
        });
    });

    it('PUT /api/projects/takeadmin/:id', function(done) {
        var username = 'test',
            username2 = 'test2',
            name = 'name',
            description = 'description';

        server.post('/api/login').send({username: username, password: username}).end(function(err, res1) {
        server.get('/api/projects/enter/' + 1).send().end(function(err, res2) {
            server.put('/api/projects/takeadmin/' + 2).send()
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.username, username2);
                    assert.equal(res.body.role, 'user');
                    assert.equal(res.body.id, 2);
                    done();
                });
        });
        });
    });

    it('GET /api/projects/enter/:id check second non admin', function(done) {
        var username = 'test',
            username2 = 'test2',
            name = 'name',
            description = 'description';

        server.post('/api/login').send({username: username, password: username}).end(function(err, res1) {
            server.get('/api/projects/enter/' + 1).send()
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.owner, username);
                    assert.equal(res.body.members.length, 2);
                    assert.equal(res.body.members[0].username, username);
                    assert.equal(res.body.members[0].role, 'owner');
                    assert.equal(res.body.members[0].id, res1.body.id);
                    assert.equal(res.body.members[1].username, username2);
                    assert.equal(res.body.members[1].role, 'user');
                    assert.equal(res.body.members[1].id, 2);
                    assert.equal(res.body.amIAdmin, true);
                    done();
                });
        });
    });
});
// console.log(res.body);
