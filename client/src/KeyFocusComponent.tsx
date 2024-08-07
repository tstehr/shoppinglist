import _ from 'lodash'
import React, { Component } from 'react'

type Direction = 'horizontal' | 'vertical'
type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
type Props = {
  rootTagName: keyof JSX.IntrinsicElements
  className?: string
  children?: React.ReactNode
  direction: Direction
} & React.HTMLAttributes<HTMLOrSVGElement>

export const KEY_FOCUS_COMPONENT_NO_FOCUS = 'KEY_FOCUS_COMPONENT_NO_FOCUS'

export default class KeyFocusComponent extends Component<Props> {
  root: Element | undefined | null
  back: ArrowKey
  forward: ArrowKey

  constructor(props: Props) {
    super(props)

    switch (props.direction) {
      case 'horizontal':
        this.back = 'ArrowLeft'
        this.forward = 'ArrowRight'
        break

      case 'vertical':
        this.back = 'ArrowUp'
        this.forward = 'ArrowDown'
        break

      default:
        throw new Error('Unknown direction')
    }
  }

  handleKeyDown = (e: React.KeyboardEvent): void => {
    if (!e.altKey && !e.ctrlKey && !e.metaKey && this.root != null && (e.key === this.back || e.key === this.forward)) {
      const root = this.root
      const focused = root.querySelector(':focus')

      if (focused == null || !(focused instanceof HTMLElement)) {
        return
      }

      const all: HTMLElement[] = Array.from(root.querySelectorAll('*'))
      const focusable = all.filter((el) => this.canReceiveFocus(el))
      let newIndex

      if (focusable.includes(focused)) {
        const index = focusable.indexOf(focused)

        if (e.key === this.back) {
          newIndex = index - 1
        } else if (e.key === this.forward) {
          newIndex = index + 1
        }
      } else {
        const index = all.indexOf(focused)
        let search

        if (e.key === this.back) {
          search = all.slice(0, index).reverse()
        } else if (e.key === this.forward) {
          search = all.slice(index)
        }

        if (search != null) {
          for (const el of search) {
            if (focusable.includes(el)) {
              newIndex = focusable.indexOf(el)
              break
            }
          }
        }
      }

      if (newIndex != null) {
        if (newIndex < 0) {
          newIndex = newIndex + focusable.length
        } else if (newIndex >= focusable.length) {
          newIndex = newIndex - focusable.length
        }

        focusable[newIndex].focus()
        e.preventDefault()
      }
    }
  }

  canReceiveFocus(el: HTMLElement): boolean {
    if (el.classList.contains(KEY_FOCUS_COMPONENT_NO_FOCUS)) {
      return false
    }

    return el.tabIndex != null && el.tabIndex !== -1
  }

  render(): JSX.Element {
    const Component = this.props.rootTagName
    const className = this.props.className != null ? this.props.className + ' KeyFocusComponent' : 'KeyFocusComponent'

    const passthroughProps = _.omit(this.props, ['rootTagName', 'className', 'children', 'direction'])

    return (
      <Component
        onKeyDown={this.handleKeyDown}
        // ts-ignore is needed as ts chokes on the typing for ref in combination with keyof jsx.Element
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={(root: Element | null): void => {
          this.root = root
        }}
        className={className}
        {...passthroughProps}
      >
        {this.props.children}
      </Component>
    )
  }
}
