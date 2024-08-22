import scrapy

class NoberoSpider(scrapy.Spider):
    name = "nobero"
    allowed_domains = ["nobero.com"]
    start_urls = ["https://nobero.com/pages/men"]

    def parse(self, response):
        if response.url == "https://nobero.com/pages/men":
            collection_links = response.css('.custom-page-season-grid-item a::attr(href)').getall()
            
            for link in collection_links:
                full_url = response.urljoin(link)
                yield response.follow(full_url, callback=self.parse_collection_page)
        else:
            yield from self.parse_collection_page(response)

    def parse_collection_page(self, response):
        category_name = response.css('.shopify-section .filter h1::text').get().strip()
        category_mapping = {
            'Oversized T-Shirts Collection': 'an oversized t-shirt',
            'Classic T-Shirts': 'a classic t-shirt',
            'Men\'s Co-ord Sets Collection': 'co-ords',
            'Men\'s Joggers Collection': 'joggers',
            'Shorts for Men': 'shorts',
            'Plus Size T-Shirts': 'plus size t-shirt'
        }

        category_text = category_mapping.get(category_name, 'Unknown category')

        product_links = response.css('.product-card-container a::attr(href)').getall()

        for link in product_links:
            full_url = response.urljoin(link)
            yield response.follow(full_url, callback=self.parse_product_details, meta={'category_text': category_text})

        next_page = response.css('li.next a::attr(href)').get()
        if next_page:
            next_page_url = response.urljoin(next_page)
            yield response.follow(next_page_url, callback=self.parse_collection_page)

    def parse_product_details(self, response):
            srcset_strings = response.css('figure.image-container img::attr(srcset)').getall()
            title = response.css('.w-full h1::text').get().strip()
            last_7_days = response.css('.product_bought_count span::text').get()
            price = response.css('h2#variant-price *::text').get()
            discount = response.css('h2#variant-save-percentage *::text').get()
            saved = response.css('h2#variant-save-flat *::text').get()

            description_parts = response.css('#description_content p::text').getall()
            description = ' '.join([part.strip() for part in description_parts if part.strip()])

            colors = response.css('label.color-select')
            color_sizes = {}
            attributes = {}
            for attribute in response.css('#product-metafields-container .product-metafields-values'):
                key = attribute.css('h4::text').get().strip()
                value = attribute.css('p::text').get().strip()
                attributes[key] = value


            for color in colors:
                color_name = color.css('input::attr(value)').get()
                color_sold_out = color.css('div.color-sold-out::text').get() == "Sold Out"
                
                sizes = []
                if not color_sold_out:
                    sizes_elements = response.css('label.size-select input::attr(value)').getall()
                    self.logger.debug(f'Sizes Elements: {sizes_elements}')
                    sizes = sizes_elements
                    
                color_sizes[color_name] = sizes

            def extract_urls(srcset_string):
                urls_with_sizes = [part.strip() for part in srcset_string.split(',')]
                urls = [url_with_size.split(' ', 1)[0] for url_with_size in urls_with_sizes]
                return urls
            
            all_urls = []
            for srcset in srcset_strings:
                urls = extract_urls(srcset)
                all_urls.extend(urls)
            
            final_urls = [url.split(',')[0].strip() for url in all_urls]

            yield {
                'url': response.url,
                'images': final_urls,
                'category': response.meta.get('category_text', 'Unknown category'),
                'title': title,
                'price': price,
                'discount': discount,
                'save_off': saved,
                'last_7_day_sale': last_7_days,
                'color_sizes': color_sizes,
                'attributes':attributes,
                'description': description

            }
