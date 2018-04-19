export default {
    methods: {
        setQuery(data) {
            !data.page ? data.page = 1 : null // 每次筛选都从第一页开始,除非指定分页
            let query = { ...this.$route.query, ...data }
            router.push({ query })
        },
        resetQuery() {
            for (let key in this.getQuery) {
                this[key] = null
            }
            router.push({
                query: {}
            })
        }
    },
    computed: {
        getQuery() {
            let routerQuery = this.$route.query
            let query = _.pickBy(routerQuery, query => query && query !== '')
            return query
        },
        page() {
            return ~~this.getQuery.page
        },
        pagesize() {
            return ~~this.getQuery.pagesize
        }
    }
}