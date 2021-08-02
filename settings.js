ALLOWED_IPS = [
    '127.0.0.1'
]

EXCLUDED_PATH_FROM_AUTH_MIDDLEWARE = [
    '/auth/login',
    '/auth/pwauth',
    '/user/create'
]


module.exports = {
    ALLOWED_IPS,
    EXCLUDED_PATH_FROM_AUTH_MIDDLEWARE
}
