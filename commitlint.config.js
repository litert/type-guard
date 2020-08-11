module.exports = {
    'extends': ['@commitlint/config-conventional'],
    'defaultIgnores': false,
    'rules': {
        'type-enum': [2, 'always', [
            'feat',
            'fix',
            'add',
            'test',
            'refactor',
            'config',
            'merge'
        ]],
        'scope-enum': [2, 'always', [
            'compiler',
            'jslang',
            'rules',
            'test',
            'skeleton',
            'doc',
            'lint',
            'branch',
            'global'
        ]],
        'scope-empty': [2, 'never'],
        'subject-min-length': [2, 'always', 5],
        'subject-max-length': [2, 'always', 50],
    }
};
