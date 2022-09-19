/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('subdistricts', function (table) {
            table.increments();
            table.string('subdistrict_name');
            table.string('province_id', 2);
            table.string('city_id', 10);
            table.timestamps(true, true);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("subdistricts");
};
