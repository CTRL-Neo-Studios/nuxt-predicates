import {defineNuxtModule, addPlugin, createResolver, addImportsDir, addServerImportsDir} from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@type32/nuxt-predicates',
		configKey: 'nuxtPredicates',
	},
	// Default configuration options of the Nuxt module
	defaults: {},
	setup(_options, _nuxt) {
		const resolver = createResolver(import.meta.url)

		// Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
		_nuxt.options.alias['@type32/nuxt-predicates'] = resolver.resolve(
			'./runtime/shared/types'
		)
		_nuxt.options.alias['@type32/nuxt-predicates'] = resolver.resolve(
			'./runtime/shared/predicate-core'
		)

		addServerImportsDir(resolver.resolve('runtime/server/utils'))
		addImportsDir(resolver.resolve('runtime/client/composables'))
	},
})
