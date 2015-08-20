/*
	Redactor Table Plugin for  10.2.3, with column-width modal added by Robin van Holst
	Updated: August 20, 2015

	Author: Robin van Holst
*/

(function($)
{
	$.Redactor.prototype.table = function()
	{
		return {
			
			getTemplate: function()
			{
				return String()
				+ '<section id="redactor-modal-table-insert">'
					+ '<label>' + this.lang.get('rows') + '</label>'
					+ '<input type="text" size="5" value="2" id="redactor-table-rows" />'
					+ '<label>' + this.lang.get('columns') + '</label>'
					+ '<input type="text" size="5" value="3" id="redactor-table-columns" />'
				+ '</section>';
			},
			getTableWidthTemplate: function()
			{
				// translation
				if( this.lang.get('table_col_width_label') == '' || typeof this.lang.get('table_col_width_label') == 'undefined'){
					var table_col_width_label = 'Geef een breedte op voor de kolom, zet er een % achter voor percentages'; // Yes, this is Dutch - Robin
				}else{
					var table_col_width_label = this.lang.get('table_col_width_label');
				}				
	
				return String()
				+ '<section id="redactor-modal-table-col-width">'
					+	'<label>'+table_col_width_label+'</label>'
						+ '<input type="text" size="5" id="redactor-table-col-width" />'	
				+ '</section>';	
			},
			init: function()
			{
				var dropdown = {};

				dropdown.insert_table = {
									title: this.lang.get('insert_table'),
									func: this.table.show,
									observe: {
										element: 'table',
										in: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};
								
				dropdown.edit_table_column_widths = {
									//title: this.lang.get('edit_table_column_widths'),
									title: 'Wijzig kolom breedte',
									func: this.table.editTableWidths,
									observe: {
										element: 'td',
										out: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};
								
				dropdown.insert_row_above = {
									title: this.lang.get('insert_row_above'),
									func: this.table.addRowAbove,
									observe: {
										element: 'table',
										out: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};

				dropdown.insert_row_below = {
									title: this.lang.get('insert_row_below'),
									func: this.table.addRowBelow,
									observe: {
										element: 'table',
										out: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};

				dropdown.insert_column_left = {
									title: this.lang.get('insert_column_left'),
									func: this.table.addColumnLeft,
									observe: {
										element: 'table',
										out: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};

				dropdown.insert_column_right = {
									title: this.lang.get('insert_column_right'),
									func: this.table.addColumnRight,
									observe: {
										element: 'table',
										out: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};

				dropdown.add_head = {
									title: this.lang.get('add_head'),
									func: this.table.addHead,
									observe: {
										element: 'table',
										out: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};

				dropdown.delete_head = {
									title: this.lang.get('delete_head'),
									func: this.table.deleteHead,
									observe: {
										element: 'table',
										out: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};
								
				dropdown.delete_column = {
									title: this.lang.get('delete_column'),
									func: this.table.deleteColumn,
									observe: {
										element: 'table',
										out: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};

				dropdown.delete_row = {
									title: this.lang.get('delete_row'),
									func: this.table.deleteRow,
									observe: {
										element: 'table',
										out: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};

				dropdown.delete_table = {
									title: this.lang.get('delete_table'),
									func: this.table.deleteTable,
									observe: {
										element: 'table',
										out: {
											attr: {
												'class': 'redactor-dropdown-link-inactive',
												'aria-disabled': true,
											}
										}
									}
								};

				this.observe.addButton('td', 'table');
				this.observe.addButton('th', 'table');

				var button = this.button.addBefore('link', 'table', this.lang.get('table'));
				this.button.addDropdown(button, dropdown);
			},
			show: function()
			{
				this.modal.addTemplate('table', this.table.getTemplate());

				this.modal.load('table', this.lang.get('insert_table'), 300);
				this.modal.createCancelButton();

				var button = this.modal.createActionButton(this.lang.get('insert'));
				button.on('click', this.table.insert);

				this.selection.save();
				this.modal.show();

				$('#redactor-table-rows').focus();

			},
			
			insert: function()
			{
				this.placeholder.remove();

				var rows = $('#redactor-table-rows').val(),
					columns = $('#redactor-table-columns').val(),
					$tableBox = $('<div>'),
					tableId = Math.floor(Math.random() * 99999),
					$table = $('<table id="table' + tableId + '"><tbody></tbody></table>'),
					i, $row, z, $column;

				for (i = 0; i < rows; i++)
				{
					$row = $('<tr>');

					for (z = 0; z < columns; z++)
					{
						$column = $('<td>' + this.opts.invisibleSpace + '</td>');

						// set the focus to the first td
						if (i === 0 && z === 0)
						{
							$column.append(this.selection.getMarker());
						}

						$($row).append($column);
					}

					$table.append($row);
				}

				$tableBox.append($table);
				var html = $tableBox.html();

				this.modal.close();
				this.selection.restore();

				if (this.table.getTable()) return;

				this.buffer.set();

				var current = this.selection.getBlock() || this.selection.getCurrent();
				if (current && current.tagName != 'BODY')
				{
					if (current.tagName == 'LI') current = $(current).closest('ul, ol');
					$(current).after(html);
				}
				else
				{
					this.insert.html(html, false);
				}

				this.selection.restore();

				var table = this.$editor.find('#table' + tableId);

				var p = table.prev("p");

				if (p.length > 0 && this.utils.isEmpty(p.html()))
				{
					p.remove();
				}

				if (!this.opts.linebreaks && (this.utils.browser('mozilla') || this.utils.browser('msie')))
				{
					var $next = table.next();
					if ($next.length === 0)
					{
						 table.after(this.opts.emptyHtml);
					}
				}

				this.observe.buttons();

				table.find('span.redactor-selection-marker').remove();
				table.removeAttr('id');

				this.code.sync();
				this.core.setCallback('insertedTable', table);
			},
			editTableWidths: function(){
				// if translation is missing:
				if( this.lang.get('table_col_width_modal_heading') == '' || typeof this.lang.get('table_col_width_modal_heading') == 'undefined'){
					var table_col_width_modal_heading = 'Kolombreedte';
				}else{
					var table_col_width_modal_heading = this.lang.get('table_col_width_modal_heading');
				}	
				
				if( this.lang.get('apply') == '' || typeof this.lang.get('apply') == 'undefined'){
					var table_col_width_modal_apply_button = 'Toepassen';
				}else{
					var table_col_width_modal_apply_button = this.lang.get('apply');
				}	
				
				this.modal.addTemplate('table_widths', this.table.getTableWidthTemplate());

				this.modal.load('table_widths',table_col_width_modal_heading, 300);
				this.modal.createCancelButton();

				var button = this.modal.createActionButton(table_col_width_modal_apply_button);
				button.on('click', this.table.applyWidth);
				
				this.selection.save();
				var $current = $(this.selection.getCurrent());
				
				this.modal.show();
				$('#redactor-table-col-width').val($current.css('width'));
				$('#redactor-table-col-width').focus();
			},
			applyWidth: function(){
				// translation
				if( this.lang.get('is_not_a_valid_value') == '' || typeof this.lang.get('is_not_a_valid_value') == 'undefined'){
					var is_not_a_valid_value = ' is geen geldige waarde!';
				}else{
					var is_not_a_valid_value = this.lang.get('is_not_a_valid_value');
				}	
				
				var new_column_width_value = $('#redactor-table-col-width').val();
				
				if(parseInt(new_column_width_value) < 1 || parseInt(new_column_width_value) > 1280 || isNaN(parseInt(new_column_width_value))){ // 1280 wide is enough I think - Robin
					alert(new_column_width_value + is_not_a_valid_value);
				}else{
					this.buffer.set(); // sets buffer for undo/redo purpose - Robin
					this.modal.close();
					
					this.selection.restore();
					var $table = this.table.getTable();
					if (!$table) return;
					
					var $current = $(this.selection.getCurrent());
					$current.css('width',new_column_width_value);
					
					this.code.sync();
				}
			},
			getTable: function()
			{
				var $table = $(this.selection.getParent()).closest('table');

				if (!this.utils.isRedactorParent($table)) return false;
				if ($table.size() === 0) return false;

				return $table;
			},
			restoreAfterDelete: function($table)
			{
				this.selection.restore();
				$table.find('span.redactor-selection-marker').remove();
				this.code.sync();
			},
			deleteTable: function()
			{
				var $table = this.table.getTable();
				if (!$table) return;

				this.buffer.set();


				var $next = $table.next();
				if (!this.opts.linebreaks && $next.length !== 0)
				{
					this.caret.setStart($next);
				}
				else
				{
					this.caret.setAfter($table);
				}


				$table.remove();

				this.code.sync();
			},
			deleteRow: function()
			{
				var $table = this.table.getTable();
				if (!$table) return;
	
				var $current = $(this.selection.getCurrent());
	
				this.buffer.set();
	
				var $current_tr = $current.closest('tr');
				var $focus_tr = $current_tr.prev().length ? $current_tr.prev() : $current_tr.next();
				if ($focus_tr.length)
				{
					var $focus_td = $focus_tr.children('td, th').first();
					if ($focus_td.length) $focus_td.prepend(this.selection.getMarker());
				}
	
				$current_tr.remove();
				this.table.restoreAfterDelete($table);
			},
			deleteColumn: function()
			{
			var $table = this.table.getTable();
			if (!$table) return;

			this.buffer.set();

			var $current = $(this.selection.getCurrent());
			var $current_td = $current.closest('td, th');
			var index = $current_td[0].cellIndex;

			$table.find('tr').each($.proxy(function(i, elem)
			{
				var $elem = $(elem);
				var focusIndex = index - 1 < 0 ? index + 1 : index - 1;
				if (i === 0) $elem.find('td, th').eq(focusIndex).prepend(this.selection.getMarker());

				$elem.find('td, th').eq(index).remove();

			}, this));

			this.table.restoreAfterDelete($table);
			},
				addHead: function()
				{
					var $table = this.table.getTable();
					if (!$table) return;
	
					this.buffer.set();
	
					if ($table.find('thead').size() !== 0)
					{
						this.table.deleteHead();
						return;
					}
	
					var tr = $table.find('tr').first().clone();
					tr.find('td').replaceWith($.proxy(function()
					{
						return $('<th>').html(this.opts.invisibleSpace);
					}, this));
	
					$thead = $('<thead></thead>').append(tr);
					$table.prepend($thead);
	
					this.code.sync();

			},
			deleteHead: function()
			{
				var $table = this.table.getTable();
				if (!$table) return;

				var $thead = $table.find('thead');
				if ($thead.size() === 0) return;

				this.buffer.set();

				$thead.remove();
				this.code.sync();
			},
			addRowAbove: function()
			{
				this.table.addRow('before');
			},
			addRowBelow: function()
			{
				this.table.addRow('after');
			},
			addColumnLeft: function()
			{
				this.table.addColumn('before');
			},
			addColumnRight: function()
			{
				this.table.addColumn('after');
			},
			addRow: function(type)
			{
				var $table = this.table.getTable();
				if (!$table) return;

				this.buffer.set();

				var $current = $(this.selection.getCurrent());
				var $current_tr = $current.closest('tr');
				var new_tr = $current_tr.clone();

				new_tr.find('th').replaceWith(function()
				{
					var $td = $('<td>');
					$td[0].attributes = this.attributes;

					return $td.append($(this).contents());
				});

				new_tr.find('td').html(this.opts.invisibleSpace);

				if (type == 'after')
				{
					$current_tr.after(new_tr);
				}
				else
				{
					$current_tr.before(new_tr);
				}

				this.code.sync();
			},
			addColumn: function (type)
			{
				var $table = this.table.getTable();
				if (!$table) return;

				var index = 0;
				var current = $(this.selection.getCurrent());

				this.buffer.set();

				var $current_tr = current.closest('tr');
				var $current_td = current.closest('td, th');

				$current_tr.find('td, th').each($.proxy(function(i, elem)
				{
					if ($(elem)[0] === $current_td[0]) index = i;

				}, this));

				$table.find('tr').each($.proxy(function(i, elem)
				{
					var $current = $(elem).find('td, th').eq(index);

					var td = $current.clone();
					td.html(this.opts.invisibleSpace);

					if (type == 'after')
					{
						$current.after(td);
					}
					else
					{
						$current.before(td);
					}

				}, this));

				this.code.sync();
			}
		};
	};
})(jQuery);