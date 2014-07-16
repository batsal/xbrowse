var FamilyGeneLookupFormView = Backbone.View.extend({

    template: _.template($('#tpl-family-gene-lookup').html()),

    initialize: function(options) {
        this.select_gene_view = new SelectGeneView();
    },

    render: function() {
        var that = this;
        $(this.el).html(this.template({}));
        this.$('.searchbox-container').html(that.select_gene_view.render().el);
        return this;
    }

});

//var GeneDiagnosticView = Backbone.View.extend({
//
//    template: _.template($('#tpl-gene-diagnostic-info').html()),
//
//    className: 'gene-diagnostic-view',
//
//    initialize: function(options) {
//        this.hbc = options.hbc;
//        this.gene_diagnostic_info = options.gene_diagnostic_info;
//        this.gene_list_info_item = options.gene_list_info_item; // todo: god, rename this
//        this.family = options.family;
//        this.data_summary = options.data_summary;
//    },
//
//    render: function() {
//        var that = this;
//        $(this.el).html(this.template({
//            gene_phenotype_summary: this.gene_diagnostic_info.gene_phenotype_summary,
//            gene_sequencing_summary: this.gene_diagnostic_info.gene_sequencing_summary,
//            variants: this.gene_diagnostic_info.variants,
//            cnvs: this.gene_diagnostic_info.cnvs,
//            family: this.family,
//            gene_list_info_item: this.gene_list_info_item,
//            data_summary: that.data_summary,
//        }));
//        if (_.contains(that.data_summary.data_available, 'callability')) {
//            _.each(this.family.individuals_with_variant_data(), function(indiv) {
//                var coverage = that.gene_diagnostic_info.gene_sequencing_summary.coverage_by_sample[indiv.indiv_id];
//                var view = new IndividualGeneCoverageView({individual: indiv, coverage: coverage});
//                that.$('.individual-coverage-container').append(view.render().el);
//            });
//        } else {
//            that.$('.individual-coverage-container').html('No callability data');
//        }
//        if (this.gene_diagnostic_info.variants.length > 0) {
//            this.$('.variants-container').html('<div class="basic-variants-list"></div>')
//            _.each(this.gene_diagnostic_info.variants, function(variant) {
//                var view = new BasicVariantView({
//                    hbc: that.hbc,
//                    variant: variant,
//                    show_genotypes: true,
//                    individuals: that.family.individuals_with_variant_data(),
//                    show_gene: false,
//                });
//                that.$('.basic-variants-list').append(view.render().el);
//            });
//        } else {
//            this.$('.variants-container').html('-');
//        }
//        if (this.gene_diagnostic_info.variants.length > 0 || this.gene_diagnostic_info.cnvs.length > 0) {
//            $(this.el).addClass('has-variants');
//        }
//        return this;
//    },
//});
//
//
//var DiagnosticSearchFormView = Backbone.View.extend({
//
//    initialize: function(options) {
//        this.hbc = options.hbc;
//        this.gene_lists = options.gene_lists;
//
//        this.select_variants_view = new SelectVariantsView({
//            hbc: this.hbc,
//        });
//        this.select_multiple_genes_container = new SelectMultipleGenesView({
//            hbc: this.hbc,
//        });
//    },
//
//    template: _.template($('#tpl-diagnostic-search-form').html()),
//
//    render: function() {
//        $(this.el).html(this.template({
//            gene_lists: this.gene_lists,
//        }));
//        this.$('#select-variants-container').html(this.select_variants_view.render().el);
//        this.$('#select-multiple-genes-container').html(this.select_multiple_genes_container.render().el);
//        return this;
//    },
//
//    get_search_spec: function() {
//       return {
//           variant_filter: this.select_variants_view.getVariantFilter(),
//           gene_list_slug: this.$('input[name=gene_list]:checked').val(),
//       }
//    },
//
//});
//
//
//var DiagnosticSearchResultsView = Backbone.View.extend({
//
//    initialize: function(options) {
//        this.family = options.family;
//        this.hbc = options.hbc;
//        this.gene_diagnostic_info_list = options.gene_diagnostic_info_list;
//        this.gene_list_info = options.gene_list_info;
//        this.data_summary = options.data_summary;
//        var gene_list_info_d = {}
//        _.each(this.gene_list_info.genes, function(g) {
//            gene_list_info_d[g.gene_id] = g
//        });
//        this.gene_list_info_d = gene_list_info_d;
//    },
//
//    template: _.template($('#tpl-diagnostic-search-results').html()),
//
//    render: function() {
//        var that = this;
//        $(this.el).html(this.template());
//
//        _.each(this.gene_diagnostic_info_list, function(gene_diagnostic_info) {
//            var view = new GeneDiagnosticView({
//                hbc: that.hbc,
//                gene_diagnostic_info: gene_diagnostic_info,
//                family: that.family,
//                gene_list_info_item: that.gene_list_info_d[gene_diagnostic_info.gene_id],
//                data_summary: that.data_summary,
//            });
//            that.$('#results').append(view.render().el);
//        });
//        return this;
//    }
//});
//

var FamilyGeneLookupHBC = HeadBallCoach.extend({

    initialize: function(options) {
        this.project_options = options.project_options;
        this.family = options.family;
        this.search_form = new FamilyGeneLookupFormView();
    },

    bind_to_dom: function() {
        $('#form-container').html(this.search_form.render().el);
//        $('#search-controls-container').html(this.search_controls.render().el);
//        this.search_controls.on('search', this.run_search, this);
    },

//    run_search: function() {
//        var that = this;
//        this.search_controls.set_loading();
//        var search_spec = that.search_form.get_search_spec();
//
//        var url = URL_PREFIX + 'api/diagnostic-search';
//        var post_data = {
//            project_id: that.family.get('project_id'),
//            family_id: that.family.get('family_id'),
//            gene_list_slug: search_spec.gene_list_slug,
//            variant_filter: JSON.stringify(search_spec.variant_filter.toJSON()),
//        };
//
//        $.get(url, post_data, function(data) {
//            if (data.is_error) {
//                alert('There was an error with your search: ' + data.error);
//            } else {
//                var results_view = new DiagnosticSearchResultsView({
//                    gene_diagnostic_info_list: data.gene_diagnostic_info_list,
//                    gene_list_info: data.gene_list_info,
//                    data_summary: data.data_summary,
//                    family: that.family,
//                    hbc: that,
//                });
//                $('#results-container').html(results_view.render().el);
//            }
//            that.search_controls.set_enabled();
//        });
//
//    },
});


$(document).ready(function() {

    var hbc = new FamilyGeneLookupHBC({
    });

    hbc.bind_to_dom();
    Backbone.history.start();
    window.hbc = hbc;

});






