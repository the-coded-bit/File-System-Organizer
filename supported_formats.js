
let supported_formats = {};
supported_formats = {
    media : ['mp4', 'mkv'],
    archives : ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', 'xz'],
    documents : ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app : ['exe', 'dmg', 'pkg', 'deb']
}

module.exports = supported_formats;