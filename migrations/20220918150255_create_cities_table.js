/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('cities', function (table) {
            table.increments();
            table.string('city_name');
            table.string('type', 10);
            table.string('province_id', 2);
            table.string('postal_code', 10);
            table.timestamps(true, true);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("cities");
};
