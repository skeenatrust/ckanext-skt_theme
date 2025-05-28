import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
import ckan.model as model

def get_recent_datasets(limit=3):
    """Return a list of most recently added datasets."""
    try:
        pkg_search = toolkit.get_action('package_search')
        data_dict = {
            'sort': 'metadata_modified desc',
            'rows': limit,
            'include_private': False,
        }
        result = pkg_search({}, data_dict)
        return result['results']
    except (toolkit.ObjectNotFound, toolkit.ValidationError, toolkit.NotAuthorized):
        return []

def get_total_resource_count():
    """
    returns the total count of active resources
    """
    try:
        resource_count = model.Session.query(model.Resource)\
            .filter(model.Resource.state == 'active')\
            .count()
        
        # if value is none
        if resource_count is None or resource_count == '':
            return 0
        return int(resource_count)
        
    except Exception:
        return 0


class SktThemeDevPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.ITemplateHelpers)
    

    # IConfigurer

    def update_config(self, config_):
        toolkit.add_template_directory(config_, "templates")
        toolkit.add_public_directory(config_, "public")
        toolkit.add_resource("assets", "skt_theme_dev")

    def get_helpers(self):
        return {
            'get_recent_datasets': get_recent_datasets,
            'get_total_resource_count': get_total_resource_count
        }