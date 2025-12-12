import type { Schema, Struct } from '@strapi/strapi';

export interface AboutPageHistoryStory extends Struct.ComponentSchema {
  collectionName: 'components_about_page_history_stories';
  info: {
    displayName: 'History Story';
  };
  attributes: {
    content: Schema.Attribute.Component<'shared.styled-text', true> &
      Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface AboutPageTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_about_page_team_members';
  info: {
    displayName: 'Team Member';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface GivePagePdfLink extends Struct.ComponentSchema {
  collectionName: 'components_give_page_pdf_links';
  info: {
    displayName: 'PDF Link';
  };
  attributes: {
    pdf: Schema.Attribute.Media<'files'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PlanYourVisitPageScheduleItem extends Struct.ComponentSchema {
  collectionName: 'components_plan_your_visit_page_schedule_items';
  info: {
    displayName: 'Schedule Item';
  };
  attributes: {
    description: Schema.Attribute.Component<'shared.styled-text', true> &
      Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedCategory extends Struct.ComponentSchema {
  collectionName: 'components_shared_categories';
  info: {
    displayName: 'Category';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    slug: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedInfoSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_info_sections';
  info: {
    displayName: 'Info Section';
  };
  attributes: {
    button_text: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    content: Schema.Attribute.Component<'shared.styled-text', true> &
      Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavigation extends Struct.ComponentSchema {
  collectionName: 'components_shared_navigations';
  info: {
    displayName: 'Navigation';
  };
  attributes: {
    slug: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStyledText extends Struct.ComponentSchema {
  collectionName: 'components_shared_styled_texts';
  info: {
    displayName: 'Styled Text';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<
      ['Default', 'Website-Theme-Color1', 'Website-Theme-Color2']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Default'>;
    font_size: Schema.Attribute.Enumeration<
      ['Small', 'Normal', 'Large', 'Extra-Large']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Normal'>;
    font_style: Schema.Attribute.Enumeration<
      ['Normal', 'Italic', 'Bold', 'Underline']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Normal'>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about-page.history-story': AboutPageHistoryStory;
      'about-page.team-member': AboutPageTeamMember;
      'give-page.pdf-link': GivePagePdfLink;
      'plan-your-visit-page.schedule-item': PlanYourVisitPageScheduleItem;
      'shared.category': SharedCategory;
      'shared.info-section': SharedInfoSection;
      'shared.navigation': SharedNavigation;
      'shared.styled-text': SharedStyledText;
    }
  }
}
