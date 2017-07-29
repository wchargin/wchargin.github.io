/*
 * The main component for the skills page.
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite/no-important';

import Colors, {hexWithAlpha} from '../../data/Colors';
import {Blurb, Heading, Link, LinkButton, NoScript} from '../../Components';
import {skillPropType, createSkillsData} from './skillsData';

// Use the `image` and `extraResources` skills properties to determine
// the set of resources to preload.
Link.registerPreloadResources('/skills', () =>
    createSkillsData().reduce((acc, group) => [
        ...acc,
        ...group.reduce((acc, {image, extraResources}) => [
            ...acc,
            image,
            ...(extraResources || []),
        ], []),
    ], []));

export default class SkillsPage extends Component {

    render() {
        return <div>
            <Heading level={1}>Skills</Heading>
            <NoScript>
                <SkillsStaticView />
            </NoScript>
            <SkillsMasterDetailView
                className={`yesscript ${css(styles.hideOnSmallScreen)}`}
            />
            <SkillsStaticView className={css(styles.showOnSmallScreen)} />
        </div>;
    }

}

/*
 * A component that renders the skill data as blurbs. This is suitable
 * for users that can't interact with the `SkillsMasterDetailView`
 * (which is the preferred view).
 *
 * All properties are forwarded to the root component.
 */
class SkillsStaticView extends Component {

    constructor() {
        super();
        this.flatSkills = createSkillsData().reduce(
            (acc, group) => [...acc, ...group], []);
    }

    render() {
        const alternator = Blurb.makeAlternator();
        return <div {...this.props}>
            {this.flatSkills.map((skill, i) =>
                <Blurb
                    key={i}
                    name={skill.displayName || skill.name}
                    image={skill.image}
                    imagePosition={alternator()}
                >
                    {skill.description}
                </Blurb>)}
        </div>;
    }

}

/*
 * A stateful component that renders the skills data by linking
 * `SkillSelector`s to `SkillView`s, showing (at most) one skill
 * description at a time.
 *
 * All properties are forwarded to the root component.
 */
class SkillsMasterDetailView extends Component {

    constructor() {
        super();
        this.skills = createSkillsData();
        this.state = {
            activeGroup: null,
            activeIndex: null,
        };
    }

    render() {
        const skills = this.skills;
        return <div {...this.props}>
            <p>
                Please select a programming language, computer system, or miscellaneous skill below to get a brief description of my experience.
            </p>
            {skills.map((group, i) =>
                <div key={i}>
                    {this._renderMasterView(group, i)}
                    {this._renderDetailView(group, i)}
                </div>)}
        </div>;
    }

    _renderMasterView(group, groupIndex) {
        const isActive = groupIndex === this.state.activeGroup;
        return <SkillSelector
            skills={group}
            activeIndex={isActive ? this.state.activeIndex : null}
            onSelect={itemIndex => this.setState({
                activeGroup: groupIndex,
                activeIndex: itemIndex,
            })}
        />;
    }

    _renderDetailView(group, groupIndex) {
        if (groupIndex !== this.state.activeGroup) {
            return null;
        }
        if (this.state.activeIndex === null) {
            return null;
        }
        return <SkillView skill={group[this.state.activeIndex]} />;
    }

}

/*
 * A component to render icons for a skill group, notifying its parent
 * when an icon is clicked.
 */
class SkillSelector extends Component {

    static propTypes = {
        skills: PropTypes.arrayOf(skillPropType.isRequired).isRequired,
        activeIndex: PropTypes.number,
        onSelect: PropTypes.func.isRequired,  // int -> ()
    }

    render() {
        const {skills, activeIndex, onSelect} = this.props;
        const isActive = (skillIndex) => skillIndex === activeIndex;
        return <div className={css(styles.masterList)}>
            {skills.map(({name, image}, skillIndex) =>
                <LinkButton
                    key={skillIndex}
                    className={css(
                        styles.masterItem,
                        isActive(skillIndex) && styles.masterItemActive,
                    )}
                    onClick={() => onSelect(
                        isActive(skillIndex) ? null : skillIndex)}
                    aria-pressed={isActive(skillIndex)}
                    role="button"
                >
                    <img
                        alt={name}
                        src={image}
                        className={css(styles.masterImage)}
                    />
                </LinkButton>)}
        </div>;
    }

}

/*
 * A component to render the body of a skill.
 */
class SkillView extends Component {

    static propTypes = {
        skill: skillPropType.isRequired,
    }

    render() {
        const {skill} = this.props;
        return <div className={css(styles.detailView)}>
            <Heading level={2}>{skill.displayName || skill.name}</Heading>
            {skill.description}
        </div>;
    }

}

const smallScreenQuery = '@media(max-width:600px)';
const styles = StyleSheet.create({
    hideOnSmallScreen: {
        [smallScreenQuery]: {
            display: 'none',
        },
    },
    showOnSmallScreen: {
        display: 'none',
        [smallScreenQuery]: {
            display: 'unset',
        },
    },
    masterList: {
        textAlign: 'center',
        paddingTop: 20,
    },
    masterItem: {
        display: 'inline-block',  // needed for proper sizing for some reason
        transition: 'opacity 0.2s ease, border-bottom-color 0.2s ease',
        opacity: 0.4,
        ':hover': {
            opacity: 0.8,
        },
        ':focus': {
            opacity: 0.8,
        },
        paddingBottom: 4,
        borderBottom: `3px rgba(0,0,0,0) solid`,
    },
    masterItemActive: {
        opacity: 1.0,
        ':hover': {
            opacity: 1.0,
        },
        ':focus': {
            opacity: 1.0,
        },
        borderBottom: `3px ${Colors.accentBlue.base} solid`,
    },
    masterImage: {
        // Specifying both width and height prevents reflows as images load.
        width: 96,
        height: 96,
        paddingLeft: 10,
        paddingRight: 10,
    },
    detailView: {
        transition: 'height 0.3s ease',
        background: hexWithAlpha(Colors.accentBlue.base, 0.1),
        border: `1px ${Colors.accentBlue.base} solid`,
        borderLeft: 'none',
        borderRight: 'none',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15,
        marginBottom: 10,
    },
});
